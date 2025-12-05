FROM openjdk:17

WORKDIR /app

COPY target/rule-engine-1.0.0.jar app.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "app.jar"]
