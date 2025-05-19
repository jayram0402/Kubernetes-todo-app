#!/bin/bash

set -e

# Constants
FRONTEND_IMAGE=todo-frontend:latest
BACKEND_IMAGE=todo-backend:latest
KIND_CLUSTER=todo-cluster

echo "Building Docker images..."

docker build -t $FRONTEND_IMAGE ./frontend
docker build -t $BACKEND_IMAGE ./backend

echo "Loading Docker images into Kind cluster..."

kind load docker-image $FRONTEND_IMAGE --name $KIND_CLUSTER
kind load docker-image $BACKEND_IMAGE --name $KIND_CLUSTER

echo "Installing NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.4/deploy/static/provider/kind/deploy.yaml

echo "Waiting for Ingress controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=Ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

echo "Ingress controller is ready."

echo "Applying Secrets and ConfigMap..."
kubectl apply -f k8s/secrets.yml
kubectl apply -f k8s/configmap.yml

echo "Deploying MongoDB StatefulSet and Service..."
kubectl apply -f k8s/mongo-statefulset.yml
kubectl apply -f k8s/mongo-service.yml

echo "Deploying Backend..."
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/backend-service.yml

echo "Deploying Frontend..."
kubectl apply -f k8s/frontend-deployment.yml
kubectl apply -f k8s/frontend-service.yml

echo "Applying Ingress config..."
kubectl apply -f k8s/ingress.yml

echo "Deploying MongoDB health-check CronJob..."
kubectl apply -f k8s/mongo-health-check-cronjob.yml

echo "Patching /etc/hosts for todo.local..."
grep -q "todo.local" /etc/hosts || echo "127.0.0.1 todo.local" | sudo tee -a /etc/hosts > /dev/null

echo ""
echo "All steps completed successfully!"
echo "Visit your app: http://todo.local"
echo "Use 'kubectl get all' to monitor deployment."
