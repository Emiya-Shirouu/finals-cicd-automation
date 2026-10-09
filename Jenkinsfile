pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'excalsius'
        TAG = "${env.BUILD_NUMBER}"
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
                    sh '''
                      docker run --rm --volumes-from jenkins -w "$PWD" node:20-alpine \
                        sh -c "npm install && npm test"
                    '''
                }
            }
        }

        stage('Test Lookup Module') {
            steps {
                dir('lookup') {
                    sh '''
                      docker run --rm --volumes-from jenkins -w "$PWD" node:20-alpine \
                        sh -c "npm install && npm test"
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "docker build -t ${env.DOCKER_REGISTRY}/finals-api:${env.TAG} -t ${env.DOCKER_REGISTRY}/finals-api:latest ./api"
                sh "docker build -t ${env.DOCKER_REGISTRY}/finals-frontend:${env.TAG} -t ${env.DOCKER_REGISTRY}/finals-frontend:latest ./frontend"
                sh "docker build -t ${env.DOCKER_REGISTRY}/finals-lookup:${env.TAG} -t ${env.DOCKER_REGISTRY}/finals-lookup:latest ./lookup"
            }
        }

        stage('Push to Registry') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub-credentials', variable: 'DOCKER_PASSWORD')]) {
                    sh "echo \$DOCKER_PASSWORD | docker login -u ${env.DOCKER_REGISTRY} --password-stdin"
                    sh "docker push ${env.DOCKER_REGISTRY}/finals-api:${env.TAG}"
                    sh "docker push ${env.DOCKER_REGISTRY}/finals-api:latest"
                    sh "docker push ${env.DOCKER_REGISTRY}/finals-frontend:${env.TAG}"
                    sh "docker push ${env.DOCKER_REGISTRY}/finals-frontend:latest"
                    sh "docker push ${env.DOCKER_REGISTRY}/finals-lookup:${env.TAG}"
                    sh "docker push ${env.DOCKER_REGISTRY}/finals-lookup:latest"
                }
            }
        }

        stage('Deploy via Docker Compose') {
            steps {
                sh 'docker compose down'
                sh 'docker compose up -d'
            }
        }

        stage('Smoke Test') {
            steps {
                // Jenkins is itself a container, so "localhost" is not the host.
                // Run curl in a throwaway container on the host network instead.
                sh '''
                  for i in $(seq 1 12); do
                    if docker run --rm --network host curlimages/curl -f http://localhost:3080/health; then
                      echo "Smoke test passed"; exit 0
                    fi
                    echo "Waiting for services..."; sleep 5
                  done
                  echo "Smoke test failed"; exit 1
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline build ${TAG} completed successfully and application deployed!"
        }
        failure {
            echo "Pipeline build ${TAG} failed. Please check the stage logs for details."
        }
    }
}