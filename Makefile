VERSAO := $(shell mvn help:evaluate -Dexpression=project.version -q -DforceStdout)

build-push-docker-image:
	echo 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 | docker login ghcr.io --username andrepenteado --password-stdin
	mvn -U clean package -DskipTests --file backend/pom.xml
	docker build -f docker/Dockerfile-backend -t ghcr.io/andrepenteado/ap-roove/backend -t ghcr.io/andrepenteado/ap-roove/backend:$(VERSAO) .
	docker push ghcr.io/andrepenteado/ap-roove/backend
	docker push ghcr.io/andrepenteado/ap-roove/backend:$(VERSAO)
	docker logout ghcr.io