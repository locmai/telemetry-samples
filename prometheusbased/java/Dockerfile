FROM openjdk:11.0.4-jre-slim

# copy the packaged jar file into our docker image
COPY target/telemetry_sample_java-1.0-SNAPSHOT-jar-with-dependencies.jar /telemetry_sample_java.jar

EXPOSE 8080

# set the startup command to execute the jar
CMD ["java", "-jar", "/telemetry_sample_java.jar"]