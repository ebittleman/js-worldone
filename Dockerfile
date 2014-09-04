#
# Nginx Dockerfile
#
# https://github.com/dockerfile/nginx
#

# Pull base image.
FROM ubuntu:14.04

# Install Nginx.
RUN \
  apt-get update && \
  apt-get install -y net-tools dialog wget software-properties-common python-software-properties

RUN \
  add-apt-repository -y ppa:nginx/stable && \
  apt-get update && \
  apt-get install -y nginx && \
  rm -rf /var/lib/apt/lists/* && \
  rm -f /etc/nginx/nginx.conf && \
  chown -R www-data:www-data /var/lib/nginx

ADD etc/nginx.conf /etc/nginx/nginx.conf

RUN  echo "\ndaemon off;" >> /etc/nginx/nginx.conf

RUN mkdir /app

ADD src/ /app

# Define mountable directories.
VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/conf.d", "/var/log/nginx"]

# Define working directory.
WORKDIR /etc/nginx

# Define default command.
CMD ["nginx"]

# Expose ports.
EXPOSE 80
EXPOSE 443