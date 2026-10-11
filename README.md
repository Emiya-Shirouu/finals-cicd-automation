# Finals CI/CD Automation Project

## Project Description
A containerized multi-service web application built with automated CI/CD pipelines, automated testing, relational database integration, API microservices, a lookup service, and an Nginx frontend interface.

---

## Architecture Diagram

![Architecture Diagram](Diagram-Git.png)

---

## Prerequisites
* [Docker](https://www.docker.com/) and Docker Compose
* [Jenkins](https://www.jenkins.io/)
* Node.js (v18+)
* Git

---

## How to Start Jenkins and the Stack

### 1. Starting Jenkins
If running Jenkins in a Docker container:
```bash
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
