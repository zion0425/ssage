# 🐧 Base 이미지 선택 (OpenJDK 17)
FROM openjdk:17-jdk-slim

# 🏠 작업 디렉터리 설정
WORKDIR /app

# 📦 JAR 파일 복사
COPY build/libs/ssage-0.0.1-SNAPSHOT.jar app.jar

# 🌐 ChromeDriver 실행을 위한 필수 라이브러리 설치
RUN apt update && apt install -y \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxrandr2 \
    libgbm-dev \
    libasound2 \
    libnspr4 \
    libnss3 \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils

# 🌐 환경변수 설정 (호스트 OS의 Chromium & ChromeDriver 사용)
ENV CHROME_BIN="/usr/bin/chromium-browser"
ENV CHROME_DRIVER="/usr/local/bin/chromedriver"

# 🌐 컨테이너 내에서 사용될 포트
EXPOSE 8081

# 🚀 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
