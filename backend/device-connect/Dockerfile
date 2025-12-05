FROM openjdk:17

WORKDIR /app

COPY target/device-connect-1.0.0.jar app.jar

EXPOSE 8090 8091

ENTRYPOINT ["java", "-jar", "app.jar"]
