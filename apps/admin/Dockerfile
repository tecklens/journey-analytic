# Sử dụng Node.js làm base image
FROM node:20.18.2 AS builder

WORKDIR /app

# Cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Sao chép mã nguồn
COPY . .

# Build ứng dụng React
RUN npm run build --workspace=admin

# Tạo production image với Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Xóa file mặc định của Nginx
RUN rm -rf ./*

# Sao chép file build vào Nginx
COPY --from=builder /app/dist/apps/admin ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
