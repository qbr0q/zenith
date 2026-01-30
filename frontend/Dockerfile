# Этап 1: Сборка
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап 2: Раздача готовых файлов
FROM nginx:stable-alpine
# Копируем только билд из первого этапа в папку, которую обслуживает nginx
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]