VERSAO_BACKEND := $(shell mvn help:evaluate -Dexpression=project.version -q -DforceStdout --file backend/pom.xml)
VERSAO_FRONTEND := $(shell cd frontend && npm pkg get version | sed 's/"//g')

build-backend:
	mvn -U clean package --file backend/pom.xml -DskipTests
	docker build -f backend/Dockerfile -t ghcr.io/andrepenteado/ap-roove/backend -t ghcr.io/andrepenteado/ap-roove/backend:$(VERSAO_BACKEND) .
	echo $(GITHUB_TOKEN) | docker login ghcr.io --username andrepenteado --password-stdin
	docker push ghcr.io/andrepenteado/ap-roove/backend
	docker push ghcr.io/andrepenteado/ap-roove/backend:$(VERSAO_BACKEND)
	docker logout ghcr.io

build-frontend:
	docker build -f frontend/Dockerfile -t ghcr.io/andrepenteado/ap-roove/frontend -t ghcr.io/andrepenteado/ap-roove/frontend:$(VERSAO_FRONTEND) ./frontend
	echo $(GITHUB_TOKEN) | docker login ghcr.io --username andrepenteado --password-stdin
	docker push ghcr.io/andrepenteado/ap-roove/frontend
	docker push ghcr.io/andrepenteado/ap-roove/frontend:$(VERSAO_FRONTEND)
	docker logout ghcr.io

start:
	docker compose -f docker/docker-compose.yml up -d

stop:
	docker compose -f docker/docker-compose.yml down

update:
	$(MAKE) stop
	echo $(GITHUB_TOKEN) | docker login ghcr.io --username andrepenteado --password-stdin
	docker image pull postgres:14.5
	docker image pull ghcr.io/andrepenteado/ap-roove/backend
	docker image pull ghcr.io/andrepenteado/ap-roove/frontend
	docker logout ghcr.io
	$(MAKE) start