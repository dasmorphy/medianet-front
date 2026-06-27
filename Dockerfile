# ---------- Etapa 1: build de Angular en modo producción ----------
FROM node:18-alpine AS build
WORKDIR /app

# Instala dependencias aprovechando la caché de capas
COPY package*.json ./
RUN npm ci

# Copia el código y compila
COPY . .
RUN npm run build -- --configuration production

# ---------- Etapa 2: servir los estáticos con Nginx ----------
FROM nginx:1.25-alpine

# Configuración con fallback de rutas para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Artefactos compilados
COPY --from=build /app/dist/front-prueba /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
