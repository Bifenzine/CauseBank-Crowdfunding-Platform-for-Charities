# Stage 1: Build
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy only the POM file first to leverage Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B  # Download dependencies

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app

# Copy only the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Set production environment variables
ENV SPRING_PROFILES_ACTIVE=prod

# Expose the application port
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]