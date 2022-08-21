VERSAO := $(shell mvn help:evaluate -Dexpression=project.version -q -DforceStdout)

build-backend:
	echo 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 | docker login ghcr.io --username andrepenteado --password-stdin
	mvn -U clean package --file backend/pom.xml
	docker build -f backend/Dockerfile -t ghcr.io/andrepenteado/ap-roove/backend -t ghcr.io/andrepenteado/ap-roove/backend:$(VERSAO) .
	docker push ghcr.io/andrepenteado/ap-roove/backend
	docker push ghcr.io/andrepenteado/ap-roove/backend:$(VERSAO)
	docker logout ghcr.io