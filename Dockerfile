# Этап сборки
FROM node:18-alpine as build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая dev) для сборки
RUN npm ci --silent

# Копируем исходный код
COPY . .

# Собираем приложение для production
RUN npm run build

# Этап production
FROM nginx:alpine

# Копируем собранное приложение из папки dist
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем упрощенную конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
