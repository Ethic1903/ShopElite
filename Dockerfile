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

# Установим OpenSSL для генерации сертификата
RUN apk add --no-cache openssl

# Создаем самоподписанный сертификат
RUN mkdir -p /etc/ssl/private && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=RU/ST=Moscow/L=Moscow/O=ShopElite/CN=82.202.136.70"

# Копируем собранное приложение из папки dist
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем SSL конфигурацию nginx
COPY nginx-ssl.conf /etc/nginx/conf.d/default.conf

# Открываем порты 80 и 443
EXPOSE 80 443

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
