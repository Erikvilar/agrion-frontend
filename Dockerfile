FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html


RUN echo 'server { \
    listen 80; \
    # Atende tanto /agrion quanto /agrion/ \
    location /agrion { \
        alias /usr/share/nginx/html/; \
        index index.html; \
        try_files $uri $uri/ /agrion/index.html; \
    } \
    location = / { \
        return 301 /agrion; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]