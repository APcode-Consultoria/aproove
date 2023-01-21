VERSAO_APP := $(shell mvn help:evaluate -Dexpression=project.version -q -DforceStdout --file backend/pom.xml)
#VERSAO_FRONTEND := $(shell cd frontend && npm pkg get version | sed 's/"//g')

build-image:
	docker build -f Dockerfile -t ghcr.io/andrepenteado/aproove/aproove -t ghcr.io/andrepenteado/aproove/aproove:$(VERSAO_APP) .
	echo $(GITHUB_TOKEN) | docker login ghcr.io --username andrepenteado --password-stdin
	docker push ghcr.io/andrepenteado/aproove/aproove
	docker push ghcr.io/andrepenteado/aproove/aproove:$(VERSAO_APP)
	docker logout ghcr.io

build-local:
	cd frontend
	ng build --aot --build-optimizer --optimization --delete-output-path
	cd ..
	mvn -U clean package --file backend/pom.xml -DskipTests
	docker build -f Dockerfile.pipeline -t ghcr.io/andrepenteado/aproove/aproove -t ghcr.io/andrepenteado/aproove/aproove:$(VERSAO_APP) .
	echo $(GITHUB_TOKEN) | docker login ghcr.io --username andrepenteado --password-stdin
	docker push ghcr.io/andrepenteado/aproove/aproove
	docker push ghcr.io/andrepenteado/aproove/aproove:$(VERSAO_APP)
	docker logout ghcr.io

start:
	docker compose -f docker/docker-compose.yml up -d

stop:
	docker compose -f docker/docker-compose.yml down

update:
	$(MAKE) stop
	echo $(GITHUB_TOKEN) | docker login ghcr.io --username andrepenteado --password-stdin
	docker image pull postgres:14.5
	docker image pull ghcr.io/andrepenteado/aproove/aproove
	docker logout ghcr.io
	$(MAKE) start

dev-backend:
	docker compose -f docker/postgresql.yml up -d
	mvn -f backend/pom.xml clean spring-boot:run -Dspring-boot.run.profiles=dev
