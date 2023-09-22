# Stage 1
# Build frontend
FROM node:16-slim AS build-frontend
WORKDIR /aproove/frontend/
COPY ../frontend /aproove/frontend/
RUN npm install && npm run build --omit=dev

# Stage 2
# Build backend
FROM maven:3-amazoncorretto-21-debian AS build-backend
WORKDIR /aproove
COPY ../backend /aproove/backend/
COPY --from=build-frontend /aproove/backend/src/main/resources/static/ /aproove/backend/src/main/resources/static/
RUN mvn -U clean package --file backend/pom.xml -DskipTests

# Stage 3
# Build app 
FROM amazoncorretto:21
COPY --from=build-backend /aproove/backend/target/aproove.jar ROOT.jar
ENTRYPOINT [ "java", "-jar", "-Dserver.port=30002", "/ROOT.jar" ]
