
# 🌐 환경변수 설정 (Docker 내부에서 Chromium 실행 가능하도# 🐧 Base 이미지 선택 (OpenJDK 17)
FROM openjdk:17-jdk-slim

# 필요한 패키지 업데이트 및 설치
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxss1 \
    xdg-utils \
    && ln -s /usr/bin/chromedriver /usr/local/bin/chromedriver \
    && rm -rf /var/lib/apt/lists/*

# 환경변수 설정: Selenium이 사용할 Chromium 바이너리 경로
ENV CHROME_BIN=/usr/bin/chromium

# 🏠 작업 디렉터리 설정
WORKDIR /app

# 📦 JAR 파일 복사
COPY build/libs/ssage-0.0.1-SNAPSHOT.jar app.jar

# 🌐 컨테이너 내에서 사용될 포트
EXPOSE 8081

# 🚀 애플리케이션 실행
CMD ["java", "-jar", "app.jar"]
