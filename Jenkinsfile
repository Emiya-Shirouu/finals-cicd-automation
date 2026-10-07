pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'excalsius'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Test API Module') {
            steps {
                dir('api') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        stage('Test Lookup Module') {
            steps {
                dir('lookup') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build images using your Dockerfiles in each module folder
                    docker.image("${env.DOCKER_REGISTRY}/finals-api:latest").build("api/")
                    docker.image("${env.DOCKER_REGISTRY}/finals-frontend:latest").build("frontend/")
                    docker.image("${env.DOCKER_REGISTRY}/finals-lookup:latest").build("lookup/")
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    // Uses the Docker credentials ID you set up earlier in Jenkins
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        docker.image("${env.DOCKER_REGISTRY}/finals-api:latest").push()
                        docker.image("${env.DOCKER_REGISTRY}/finals-frontend:latest").push()
                        docker.image("${env.DOCKER_REGISTRY}/finals-lookup:latest").push()
                    }
                }
            }
        }

        stage('Deploy via Docker Compose') {
            steps {
                // Restart services using docker-compose with the updated images
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully and application deployed!'
        }
        failure {
            echo 'Pipeline failed. Please check the stage logs for details.'
        }
    }
}