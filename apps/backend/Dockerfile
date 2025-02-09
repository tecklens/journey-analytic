# Sử dụng Node.js làm base image
FROM node:20.18.2 AS builder

WORKDIR /app

# Cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Sao chép mã nguồn
COPY . .

# Build ứng dụng NestJS
RUN npm run build --workspace=backend

# Tạo production image
FROM node:20-alpine

WORKDIR /app

# Sao chép dependencies đã cài đặt từ builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

EXPOSE 3001
CMD ["node", "dist/apps/backend/main.js"]
