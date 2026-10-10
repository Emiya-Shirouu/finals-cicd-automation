# REQUIREMENT 5.1 (bullet 1): Application module #3 - the LOOKUP service (second service) - runs in its OWN container.
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
USER node
EXPOSE 3001
CMD ["npm", "start"]
