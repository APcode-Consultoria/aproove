param(
    [Parameter()]
    [string]$exec
)

switch($exec) {
    "build-all" {
        Get-Content 'C:\Users\andrepenteado\ownCloud\Particular\token-github.txt' | docker login ghcr.io --username andrepenteado --password-stdin
        cd ./frontend/ && ng build --configuration=production --output-path=dist/production && cd ../
        $VERSAO = ([xml](Get-Content ./backend/pom.xml)).project.version
        mvn -U clean package -DskipTests -f ./backend/pom.xml
        docker buildx build -f .deploy/dockerfiles/backend -t ghcr.io/andrepenteado/aproove/backend -t ghcr.io/andrepenteado/aproove/backend:$VERSAO --push .
        docker buildx build -f .deploy/dockerfiles/frontend -t ghcr.io/andrepenteado/aproove/frontend -t ghcr.io/andrepenteado/aproove/frontend:$VERSAO --push .
        cd ./frontend/ && ng build --configuration=localhost --output-path=dist/localhost && cd ../
        docker buildx build -f .deploy/dockerfiles/frontend --build-arg AMBIENTE=localhost -t ghcr.io/andrepenteado/aproove/frontend:dev --push .
        docker logout ghcr.io
    }
    Default {
        "`nInforme o parâmetro: -exec <target>`n"
    }
}
