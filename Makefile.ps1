param(
    [ValidateSet(
            "help",
            "build-all","build-frontend","build-backend","build-images",
            "test-frontend",
            "run-dev",
            "docker-login","docker-logout",
            "k8s-deploy","k8s-delete",
            "k8s-log-backend","k8s-log-frontend",
            "k8s-get"
    )]
    [string]$exec = "help"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# =====================
# VARIÁVEIS
# =====================
$Registry   = "ghcr.io"
$Namespace  = "andrepenteado/aproove"
$ModuleName = "roove"
$Ambiente   = "production"
$K8sNS      = "aproove"

$Versao = ([xml](Get-Content backend/pom.xml)).project.version

# =====================
# FUNÇÕES AUXILIARES
# =====================
function Assert-LastExit {
    param([string]$Command)

    if ($LASTEXITCODE -ne 0) {
        throw "❌ Falha ao executar: $Command (exit code $LASTEXITCODE)"
    }
}

# =====================
# DOCKER
# =====================
function Docker-Login {
#    if (-not $env:GITHUB_TOKEN) {
#        throw "❌ GITHUB_TOKEN não definido"
#    }

    Write-Host "🔐 Login no GitHub Container Registry" -ForegroundColor Cyan
    Write-Output $env:GITHUB_TOKEN | docker login $Registry --username andrepenteado --password-stdin
#    Get-Content 'C:\Users\andrepenteado\ownCloud\Particular\token-github.txt' | docker login ghcr.io --username andrepenteado --password-stdin
    Assert-LastExit "docker login"
}

function Docker-Logout {
    Write-Host "🔓 Logout do GHCR" -ForegroundColor DarkGray
    docker logout $Registry
    Assert-LastExit "docker logout"
}

# =====================
# BUILD
# =====================
function Test-Frontend {
    Write-Host "🧪 Rodando testes do frontend" -ForegroundColor Cyan

    Push-Location "frontend"

    npm ci
    Assert-LastExit "npm ci"

    npx vitest run
    Assert-LastExit "vitest run"

    Pop-Location

    Write-Host "✅ Testes do frontend aprovados" -ForegroundColor Green
}

function Build-Frontend {
    Write-Host "🎨 Build do frontend Angular ($Ambiente)" -ForegroundColor Cyan

    Test-Frontend

    Push-Location "frontend"

    ng build --configuration=$Ambiente --output-path="dist/$Ambiente"
    Assert-LastExit "ng build"

    Pop-Location

    Write-Host "✅ Frontend buildado com sucesso" -ForegroundColor Green
}

function Build-Backend {
    Write-Host "☕ Build do backend Java (Maven)" -ForegroundColor Cyan

    mvn -U -f backend/pom.xml clean package
    Assert-LastExit "mvn build"

    Write-Host "✅ Backend buildado com sucesso" -ForegroundColor Green
}

function Build-Images {
    Write-Host "🐳 Build e push das imagens Docker (versão $Versao)" -ForegroundColor Cyan

    Write-Host "📦 Backend"
    docker buildx build `
        -f "./backend/Dockerfile" `
        --build-arg MODULE_NAME=$ModuleName `
        -t "$Registry/$Namespace/backend" `
        -t "$Registry/$Namespace/backend:$Versao" `
        --push .
    Assert-LastExit "docker build backend"

    Write-Host "📦 Frontend (produção)"
    docker buildx build `
        -f "./frontend/Dockerfile" `
        --build-arg MODULE_NAME=$ModuleName `
        --build-arg ENV_NAME=$Ambiente `
        -t "$Registry/$Namespace/frontend" `
        -t "$Registry/$Namespace/frontend:$Versao" `
        --push .
    Assert-LastExit "docker build frontend prod"

    Write-Host "🚀 Imagens publicadas com sucesso" -ForegroundColor Green
}

# =====================
# EXECUÇÃO LOCAL (DEV)
# =====================
function Run-Dev {
    Write-Host "💻 Subindo backend (Spring, perfil dev) e frontend (Angular) em modo desenvolvimento" -ForegroundColor Cyan

    $envFile = ".helm/backend.env"
    if (-not (Test-Path $envFile)) {
        throw "❌ $envFile não encontrado. Copie de .helm/dev.env.example e preencha os valores."
    }

    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $key, $value = $line -split "=", 2
            Set-Item -Path "Env:$($key.Trim())" -Value $value.Trim()
        }
    }

    $backend = Start-Process -FilePath "mvn" `
        -ArgumentList "spring-boot:run", "-Dspring-boot.run.profiles=dev", "--file", "backend/pom.xml" `
        -NoNewWindow -PassThru

    try {
        Push-Location "frontend"
        npm start
    }
    finally {
        Pop-Location
        if ($backend -and -not $backend.HasExited) {
            Write-Host "🛑 Encerrando backend (PID $($backend.Id))" -ForegroundColor DarkGray
            Stop-Process -Id $backend.Id -Force
        }
    }
}

# =====================
# KUBERNETES
# =====================
function K8s-Deploy {
    Write-Host "🚀 Iniciando deploy no Kubernetes (namespace: $K8sNS)" -ForegroundColor Cyan
    # Namespace criado aqui (era o K8s-Pre-Init, que deixou de existir quando os
    # Secrets saíram daqui): apply de Namespace é idempotente, e um comando
    # separado só criava a chance de esquecê-lo. O resto vem do Vault.
    kubectl apply -f .helm/namespace.yaml
    Write-Host "Entre com a senha do git.apcode.com.br para baixar o helm chart" -ForegroundColor Blue
    $Chart        = "oci://git.apcode.com.br/andre.penteado/springboot-angular-chart"
    $ChartVersion = "1.5.0"
    helm registry login git.apcode.com.br
    helm upgrade --install backend $Chart --version $ChartVersion -f .helm/values.backend.yaml --set app.image.tag=$Versao -n aproove
    helm upgrade --install frontend $Chart --version $ChartVersion -f .helm/values.frontend.yaml --set app.image.tag=$Versao -n aproove
    Write-Host "✅ Deploy do AProove finalizado com sucesso" -ForegroundColor Green
}

function K8s-Delete {
    Write-Host "🧹 Removendo namespace $K8sNS"
    kubectl delete namespace $K8sNS
    Assert-LastExit "kubectl delete namespace"
}

function K8s-Logs($service) {
    kubectl logs -n $K8sNS service/$service -f
}

# =====================
# DISPATCH
# =====================
switch ($exec) {

    "help" {
        Write-Host ""
        Write-Host "🛠️  Makefile.ps1 — AProove"
        Write-Host ""
        Write-Host "🔐 Registry:"
        Write-Host "   docker-login         → Login no GHCR"
        Write-Host "   docker-logout        → Logout do registry"
        Write-Host ""
        Write-Host "🧪 Testes:"
        Write-Host "   test-frontend        → Roda testes unitários do frontend"
        Write-Host ""
        Write-Host "🚀 Build:"
        Write-Host "   build-frontend       → Testa + Build do frontend Angular"
        Write-Host "   build-backend        → Build do backend Java"
        Write-Host "   build-images         → Build & push das imagens Docker"
        Write-Host "   build-all            → Build completo"
        Write-Host ""
        Write-Host "💻 Desenvolvimento local:"
        Write-Host "   run-dev              → Sobe backend (Spring, perfil dev) e frontend (Angular) juntos"
        Write-Host ""
        Write-Host "☸️ Kubernetes:"
        Write-Host "   k8s-deploy           → Deploy com validação de LOGIN"
        Write-Host "   k8s-log-backend      → Logs do backend"
        Write-Host "   k8s-log-frontend     → Logs do frontend"
        Write-Host "   k8s-delete           → Remove namespace"
        Write-Host "   k8s-get              → Lista recursos"
        Write-Host ""
    }

    "docker-login"   { Docker-Login }
    "docker-logout"  { Docker-Logout }

    "test-frontend"  { Test-Frontend }
    "build-frontend" { Build-Frontend }
    "build-backend"  { Build-Backend }
    "build-images"   { Build-Images }

    "run-dev"        { Run-Dev }

    "build-all" {
        Docker-Login
        Build-Frontend
        Build-Backend
        Build-Images
        Docker-Logout
        Write-Host ""
        Write-Host "🎉 Build completo finalizado com sucesso!" -ForegroundColor Green
    }

    "k8s-deploy"     { K8s-Deploy }
    "k8s-delete"     { K8s-Delete }

    "k8s-log-backend"  { Write-Host "📄 Logs BACKEND";  K8s-Logs "aproove-backend" }
    "k8s-log-frontend" { Write-Host "📄 Logs FRONTEND"; K8s-Logs "aproove-frontend" }

    "k8s-get" {
        Write-Host "🔍 Recursos do namespace $K8sNS"
        kubectl get all -n $K8sNS
    }
}
