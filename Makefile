VERSAO_APP := $(shell mvn help:evaluate -Dexpression=project.version -q -DforceStdout --file backend/pom.xml)
#VERSAO_FRONTEND := $(shell cd frontend && npm pkg get version | sed 's/"//g')

build:
	echo $(GITHUB_TOKEN) | docker login ghcr.io --username andrepenteado --password-stdin
	cd ./frontend/ && ng build --configuration=production --output-path=dist/production && cd ../
	mvn -U clean package --file backend/pom.xml -DskipTests
	docker buildx build -f .deploy/dockerfiles/backend -t ghcr.io/andrepenteado/aproove/backend -t ghcr.io/andrepenteado/aproove/backend:$(VERSAO_APP) --push .
	docker buildx build -f .deploy/dockerfiles/frontend -t ghcr.io/andrepenteado/aproove/frontend -t ghcr.io/andrepenteado/aproove/frontend:$(VERSAO_APP) --push .
	cd ./frontend/ && ng build --configuration=localhost --output-path=dist/localhost && cd ../
	docker buildx build -f .deploy/dockerfiles/frontend --build-arg AMBIENTE=localhost -t ghcr.io/andrepenteado/aproove/frontend:dev --push .
	docker logout ghcr.io