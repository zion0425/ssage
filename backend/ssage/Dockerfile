# 🐧 Base 이미지 선택 (OpenJDK 17)
FROM openjdk:17-jdk-slim

# 🏠 작업 디렉터리 설정
WORKDIR /app

# 📦 JAR 파일 복사
COPY build/libs/ssage-0.0.1-SNAPSHOT.jar app.jar

# 🌐 필수 패키지 설치 및 업데이트
RUN apt update && apt install -y \
    curl \
    wget \
    unzip \
    jq \
    libvulkan1 \
    libasound2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libxshmfence1 \
    libxss1 \
    fonts-liberation

# 🌐 Google Chrome 설치
RUN wget -O google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg -i google-chrome.deb || apt-get install -f -y && \
    rm google-chrome.deb

# 🔍 Chrome 버전 확인 후 ChromeDriver 다운로드
RUN CHROME_VERSION=$(google-chrome --version | cut -d " " -f3 | cut -d "." -f1) && \
    echo "Detected Chrome version: $CHROME_VERSION" && \
    CHROMEDRIVER_URL="https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}.0.6099.109/linux64/chromedriver-linux64.zip" && \
    wget -O /tmp/chromedriver.zip "$CHROMEDRIVER_URL" && \
    unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/chromedriver && \
    rm /tmp/chromedriver.zip

# 🌐 환경변수 설정 (Docker 내부에서 Chrome 실행 가능하도록)
ENV CHROME_BIN="/usr/bin/google-chrome"
ENV CHROME_DRIVER="/usr/local/bin/chromedriver"

# 🌐 컨테이너 내에서 사용될 포트
EXPOSE 8081

# 🚀 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
