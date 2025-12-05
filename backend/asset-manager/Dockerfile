FROM openjdk:17

WORKDIR /app

COPY target/asset-manager-1.0.0.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]
