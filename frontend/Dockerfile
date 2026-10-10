FROM nginx:1.27-alpine
ARG BUILD_NUMBER=dev

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public /usr/share/nginx/html

# Build label so the page can show which version is live (fetch("/version.txt"))
RUN echo "${BUILD_NUMBER}" > /usr/share/nginx/html/version.txt

EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health || exit 1
