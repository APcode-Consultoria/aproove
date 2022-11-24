# Stage 1
# Build frontend
FROM node:16-slim AS build-frontend
WORKDIR /aproove/frontend/
COPY ../frontend/ /aproove/frontend/
RUN npm install && npm run build --prod

# Stage 2
# Build backend
FROM maven:3-openjdk-17 AS build-backend
WORKDIR /aproove
COPY ../backend/ /aproove/backend/
COPY --from=build-frontend /aproove/backend/src/main/resources/static/ /aproove/backend/src/main/resources/static/
RUN mvn -U clean package --file backend/pom.xml -DskipTests

# Stage 3
# Build app 
FROM openjdk:17-jdk
COPY --from=build-backend /aproove/backend/target/aproove.jar ROOT.jar
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "/ROOT.jar" ]
