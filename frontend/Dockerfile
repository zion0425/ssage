# Install dependencies & Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build  
# 이때 next.config.js의 output: 'export'로 빌드됨

# Production stage - Nginx로 정적 파일 제공
FROM nginx:stable-alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html  # ✅ 올바르게 out 폴더로 복사해야 합니다.

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
