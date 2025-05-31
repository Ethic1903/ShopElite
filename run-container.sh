#!/bin/bash

# Остановить и удалить существующий контейнер
docker stop shopelite-app 2>/dev/null || true
docker rm shopelite-app 2>/dev/null || true

# Запустить новый контейнер
docker run -d \
  --name shopelite-app \
  -p 80:80 \
  -p 3000:80 \
  --restart unless-stopped \
  shopelite_frontend

# Показать статус
echo "Container status:"
docker ps | grep shopelite-app

# Показать логи
echo "Container logs:"
docker logs shopelite-app

# Тестировать
echo "Testing endpoints:"
curl -s http://localhost:80/health || echo "Port 80 failed"
curl -s http://localhost:3000/health || echo "Port 3000 failed"
