# 🐧 Base 이미지 선택 (OpenJDK 17)
FROM openjdk:17-jdk-slim

# 🏠 작업 디렉터리 설정
WORKDIR /app

# 📦 JAR 파일 복사
COPY build/libs/ssage-0.0.1-SNAPSHOT.jar app.jar

# 🌐 필수 라이브러리 및 Chromium + dbus 설치
RUN apt update && apt install -y \
    chromium \
    dbus \
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
    libayatana-appindicator3-1 \
    xdg-utils \
    wget unzip

# ✅ ChromeDriver 최신 버전 다운로드 및 설치
RUN CHROMIUM_VERSION=$(chromium --version | awk '{print $2}') && \
    wget -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/$CHROMIUM_VERSION/chromedriver_linux64.zip && \
    unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/chromedriver && \
    rm /tmp/chromedriver.zip

# ✅ DBus 서비스 실행 (컨테이너 내부에서 `chromium`이 정상 실행되도록 설정)
RUN mkdir -p /run/dbus && dbus-daemon --system --fork

# 🌐 환경변수 설정 (Docker 내부에서 Chromium 실행 가능하도록)
ENV CHROME_BIN="/usr/bin/chromium"
ENV CHROME_DRIVER="/usr/local/bin/chromedriver"

# 🌐 컨테이너 내에서 사용될 포트
EXPOSE 8081

# 🚀 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
