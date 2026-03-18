# Dockerfile for Bahmni AI Integration Backend
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production
EXPOSE 3001
CMD ["node", "server.js"]
