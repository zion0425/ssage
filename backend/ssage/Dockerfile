# 🐧 Base 이미지 선택 (OpenJDK 17)
FROM openjdk:17-jdk-slim

# 🏠 작업 디렉터리 설정
WORKDIR /app

# 📦 JAR 파일 복사
COPY build/libs/ssage-0.0.1-SNAPSHOT.jar app.jar

RUN apt update && apt install -y chromium-browser
RUN chmod -R 777 /tmp

# 🌐 컨테이너 내에서 사용될 포트
EXPOSE 8081

# 🚀 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]

