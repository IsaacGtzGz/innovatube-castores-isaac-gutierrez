# Imagen Base
FROM node:18-alpine

# Directorio de Trabajo
WORKDIR /usr/src/app

# Dependencias
COPY package*.json ./
RUN npm install --production

# Código Fuente
COPY . .

# Puerto de Exposición
EXPOSE 3000

# Comando de Ejecución
CMD ["node", "src/app.js"]