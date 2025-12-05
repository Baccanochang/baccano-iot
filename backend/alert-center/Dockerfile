FROM openjdk:17

WORKDIR /app

COPY target/alert-center-1.0.0.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]
