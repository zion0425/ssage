# Install dependencies & Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npx next export -o out

# Nginx를 사용한 정적파일 서빙 단계
FROM nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html

# 기본 Nginx 설정을 사용하되, SPA를 위한 fallback 처리 (필수)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
