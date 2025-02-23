# 🐧 Base 이미지 선택 (OpenJDK 17)
FROM openjdk:17-jdk-slim

# 🏠 작업 디렉터리 설정
WORKDIR /app

# 📦 JAR 파일 복사
COPY build/libs/ssage-0.0.1-SNAPSHOT.jar app.jar

# 🌐 기존 `chromium` 패키지 제거 후, 필요한 패키지 설치
RUN apt update && apt remove --purge -y chromium chromium-browser && apt autoremove -y
RUN apt update && apt install -y \
    dbus \
    curl \
    jq \
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
    wget unzip \
    chromium

# ✅ 정확한 ChromeDriver 버전 자동 검색 후 설치
RUN CHROMIUM_VERSION=$(chromium --version | awk '{print $2}' | cut -d '.' -f1) && \
    LATEST_CHROMEDRIVER_URL=$(curl -s "https://googlechromelabs.github.io/chrome-for-testing/latest-patch-versions-per-build-with-downloads.json" | jq -r --arg CHROMIUM_VERSION "$CHROMIUM_VERSION" '.builds[$CHROMIUM_VERSION].downloads.chromedriver.linux64.url') && \
    wget -O /tmp/chromedriver.zip "$LATEST_CHROMEDRIVER_URL" && \
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
