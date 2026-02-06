param(
    [ValidateSet(
            "help",
            "build-all","build-frontend","build-backend","build-images",
            "docker-login","docker-logout",
            "k8s-deploy","k8s-delete",
            "k8s-log-backend","k8s-log-frontend",
            "k8s-update",
            "k8s-get"
    )]
    [string]$exec = "help"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# =====================
# VARIÁVEIS
# =====================
$Registry  = "ghcr.io"
$Namespace = "andrepenteado/aproove"
$Ambiente  = "production"
$K8sNS     = "aproove"

$LoginHealthUrl = "https://login.apcode.com.br/actuator/health"

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
#    $env:GITHUB_TOKEN | docker login $Registry --username andrepenteado --password-stdin
    Get-Content 'C:\Users\andrepenteado\ownCloud\Particular\token-github.txt' | docker login ghcr.io --username andrepenteado --password-stdin
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
function Build-Frontend {
    Write-Host "🎨 Build do frontend Angular ($Ambiente)" -ForegroundColor Cyan

    Push-Location "frontend"

    npm ci
    Assert-LastExit "npm ci"

    ng build --configuration=$Ambiente --output-path="dist/$Ambiente"
    Assert-LastExit "ng build"

    Pop-Location

    Write-Host "✅ Frontend buildado com sucesso" -ForegroundColor Green
}

function Build-Backend {
    Write-Host "☕ Build do backend Java (Maven)" -ForegroundColor Cyan

    mvn -U -f backend/pom.xml clean package -DskipTests
    Assert-LastExit "mvn build"

    Write-Host "✅ Backend buildado com sucesso" -ForegroundColor Green
}

function Build-Images {
    Write-Host "🐳 Build e push das imagens Docker (versão $Versao)" -ForegroundColor Cyan

    Write-Host "📦 Backend"
    docker buildx build `
        -f ".deploy/dockerfiles/backend" `
        -t "$Registry/$Namespace/backend" `
        -t "$Registry/$Namespace/backend:$Versao" `
        --push .
    Assert-LastExit "docker build backend"

    Write-Host "📦 Frontend (produção)"
    docker buildx build `
        -f ".deploy/dockerfiles/frontend" `
        -t "$Registry/$Namespace/frontend" `
        -t "$Registry/$Namespace/frontend:$Versao" `
        --push .
    Assert-LastExit "docker build frontend prod"

    Write-Host "🚀 Imagens publicadas com sucesso" -ForegroundColor Green
}

# =====================
# KUBERNETES
# =====================
function K8s-Deploy {
    Write-Host "🚀 [1/4] Inicializando namespace e secrets"
    kubectl apply -f .deploy/kubernetes/00-namespace.yml
    Assert-LastExit "kubectl namespace"

    kubectl apply -f .deploy/kubernetes/01-secret.yml
    Assert-LastExit "kubectl secret"

    Write-Host "🔐 [2/4] Validando LOGIN externo"
    $ok = $false

    for ($i = 1; $i -le 60; $i++) {
        try {
            Invoke-WebRequest -Uri $LoginHealthUrl -UseBasicParsing -TimeoutSec 5 | Out-Null
            $ok = $true
            break
        } catch {
            Write-Host "⏳ Login ainda não disponível..."
            Start-Sleep -Seconds 5
        }
    }

    if (-not $ok) {
        throw "❌ LOGIN indisponível. Abortando deploy."
    }

    Write-Host "🚀 [3/4] Deploy do backend e frontend"
    kubectl apply -f .deploy/kubernetes/02-deployment-backend.yml
    kubectl apply -f .deploy/kubernetes/02-deployment-frontend.yml
    Assert-LastExit "kubectl deploy apps"

    Write-Host "🌐 [4/4] Aplicando ingress"
    kubectl apply -f .deploy/kubernetes/03-ingress.yml
    Assert-LastExit "kubectl ingress"

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

function K8s-Rollout {
    Write-Host "♻️ Reiniciando BACKEND e FRONTEND" -ForegroundColor Cyan

    foreach ($deploy in @("aproove-backend","aproove-frontend")) {
        kubectl rollout restart deployment $deploy -n $K8sNS
        Assert-LastExit "kubectl rollout restart $deploy"

        kubectl rollout status deployment $deploy -n $K8sNS
        Assert-LastExit "kubectl rollout status $deploy"
    }

    Write-Host "✅ Rollout finalizado" -ForegroundColor Green
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
        Write-Host "🚀 Build:"
        Write-Host "   build-frontend       → Build do frontend Angular"
        Write-Host "   build-backend        → Build do backend Java"
        Write-Host "   build-images         → Build & push das imagens Docker"
        Write-Host "   build-all            → Build completo"
        Write-Host ""
        Write-Host "☸️ Kubernetes:"
        Write-Host "   k8s-deploy           → Deploy com validação de LOGIN"
        Write-Host "   k8s-update           → Reinicia backend e frontend"
        Write-Host "   k8s-log-backend      → Logs do backend"
        Write-Host "   k8s-log-frontend     → Logs do frontend"
        Write-Host "   k8s-delete           → Remove namespace"
        Write-Host "   k8s-get              → Lista recursos"
        Write-Host ""
    }

    "docker-login"   { Docker-Login }
    "docker-logout"  { Docker-Logout }

    "build-frontend" { Build-Frontend }
    "build-backend"  { Build-Backend }
    "build-images"   { Build-Images }

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

    "k8s-update"     { K8s-Rollout }

    "k8s-get" {
        Write-Host "🔍 Recursos do namespace $K8sNS"
        kubectl get all -n $K8sNS
    }
}
