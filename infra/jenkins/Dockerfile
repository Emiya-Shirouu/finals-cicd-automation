FROM jenkins/jenkins:lts-jdk17
USER root

RUN curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-26.0.0.tgz -o docker.tgz \
 && tar xzvf docker.tgz \
 && cp docker/docker /usr/bin/docker \
 && chmod +x /usr/bin/docker \
 && rm -rf docker docker.tgz

USER jenkins