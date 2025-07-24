# Imagen base oficial de Node.js
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código fuente
COPY . .

# Exponer el puerto usado por el microservicio
EXPOSE 4000

# Comando por defecto al iniciar el contenedor
CMD ["node", "index.js"]
