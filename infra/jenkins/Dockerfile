FROM jenkins/jenkins:lts-jdk17
USER root

RUN curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-26.0.0.tgz -o docker.tgz \
 && tar xzvf docker.tgz \
 && cp docker/docker /usr/bin/docker \
 && chmod +x /usr/bin/docker \
 && rm -rf docker docker.tgz

RUN mkdir -p /usr/local/lib/docker/cli-plugins \
 && curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
     -o /usr/local/lib/docker/cli-plugins/docker-compose \
 && chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
 
USER jenkins

