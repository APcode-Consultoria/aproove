deploy:
	kubectl apply -f 00-namespace.yml           \
	              -f 01-secret.yml              \
				  -f 02-deployment-backend.yml  \
				  -f 02-deployment-frontend.yml \
	              -f 03-ingress.yml

delete:
	kubectl delete namespace aproove

log-backend:
	kubectl logs -n aproove service/roove-backend -f

log-frontend:
	kubectl logs -n aproove service/roove-frontend -f

update:
	kubectl rollout restart deployment roove-backend -n aproove
	kubectl rollout restart deployment roove-frontend -n aproove
	kubectl rollout status deployment roove-backend -n aproove
	kubectl rollout status deployment roove-frontend -n aproove
	kubectl rollout history deployment roove-backend -n aproove
	kubectl rollout history deployment roove-frontend -n aproove

get:
	kubectl get all -n aproove
