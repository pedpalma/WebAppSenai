# ---------- build ----------
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /build

COPY pom.xml .
RUN mvn -q -B dependency:go-offline

COPY src ./src
RUN mvn -q -B -DskipTests package

# ---------- runtime ----------
FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=build /build/target/*.jar application.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "application.jar"]
