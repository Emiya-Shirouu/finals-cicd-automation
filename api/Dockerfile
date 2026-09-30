# REQUIREMENT 5.1 (bullet 1): Application module #2 - the API - runs in its OWN container.
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
