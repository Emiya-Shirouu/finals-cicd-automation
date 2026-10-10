# Finals CI/CD Automation Project

A containerized multi-service web application featuring automated testing, CI/CD pipelines, a database layer, API microservices, a lookup component, and a frontend user interface.

---

## Project Structure

* **`.github/workflows/ci.yml`**: GitHub Actions continuous integration and deployment pipeline configuration.
* **`docker-compose.yml`**: Orchestrates the multi-container environment for local development and testing.
* **`api/`**: Core backend API service built with Node.js, including database connection logic, Dockerfile, tests, and dependency configurations[cite: 1].
* **`lookup/`**: Secondary microservice or lookup component featuring its own application logic, Docker configuration, and test suites[cite: 1].
* **`frontend/`**: Client-facing service utilizing Nginx and static HTML assets (`index.html`, `edit.html`)[cite: 1].
* **`db/`**: Contains database initialization scripts (`init.sql`) for setting up the relational data store[cite: 1].

---

## Prerequisites

Make sure you have the following installed on your machine:
* [Docker](https://www.docker.com/) and Docker Compose
* Node.js (optional, if you want to run tests locally outside of containers)

---

## Getting Started

To run the entire multi-service application locally using Docker:

1. Clone this repository and navigate to the project root directory.
2. Run the following command to build and start all containers:
   ```bash
   docker-compose up --build
