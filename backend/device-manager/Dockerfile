FROM openjdk:17

WORKDIR /app

COPY target/device-manager-1.0.0.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]
