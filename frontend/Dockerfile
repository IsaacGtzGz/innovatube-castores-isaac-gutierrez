# Etapa de Compilacion
FROM node:18-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

# Etapa de Servidor
FROM nginx:alpine
COPY --from=build /usr/src/app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto de Exposición
EXPOSE 80

# Comando de Ejecución
CMD ["nginx", "-g", "daemon off;"]
