FROM node:12-alpine
WORKDIR /app
COPY package.json /app/package.json
RUN chown -R node:root /app
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install --unsafe-perm=true --allow-root
COPY . /app
EXPOSE 8080 
USER node
CMD ["node", "index.js"]
