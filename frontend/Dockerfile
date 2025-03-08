# Install dependencies & Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build  # 정확히 프로젝트 루트의 out에 생성됨

# Production stage - Nginx로 정적 파일 제공
FROM nginx:stable-alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html  # 생성된 정적 파일을 nginx 경로로 복사

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
