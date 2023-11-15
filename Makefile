VERSAO_APP := $(shell mvn help:evaluate -Dexpression=project.version -q -DforceStdout --file backend/pom.xml)
#VERSAO_FRONTEND := $(shell cd frontend && npm pkg get version | sed 's/"//g')

build:
	echo $(GITHUB_TOKEN) | docker login ghcr.io --username andrepenteado --password-stdin
	npm --prefix ./frontend run build --omit=dev -- "-c=production"
	mvn -U clean package --file backend/pom.xml -DskipTests
	docker build -f .docker/Dockerfile.pipeline -t ghcr.io/andrepenteado/aproove/aproove -t ghcr.io/andrepenteado/aproove/aproove:$(VERSAO_APP) .
	echo $(GITHUB_TOKEN) | docker login ghcr.io --username andrepenteado --password-stdin
	docker push ghcr.io/andrepenteado/aproove/aproove
	docker push ghcr.io/andrepenteado/aproove/aproove:$(VERSAO_APP)
	docker logout ghcr.io

start:
	docker compose -f .docker/docker-compose.yml up -d

stop:
	docker compose -f .docker/docker-compose.yml down

update:
	echo $(GITHUB_TOKEN) | docker login ghcr.io --username andrepenteado --password-stdin
	$(MAKE) stop
	docker image pull postgres:15.2
	docker image pull ghcr.io/andrepenteado/aproove/aproove
	docker logout ghcr.io
	$(MAKE) start

start-dev:
	docker compose -f .docker/postgresql.yml up -d
	mvn -f backend/pom.xml clean spring-boot:run -Dspring-boot.run.profiles=dev
