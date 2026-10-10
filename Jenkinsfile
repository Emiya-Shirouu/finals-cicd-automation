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
                      /usr/bin/docker run --rm --volumes-from jenkins -w "$PWD" node:20-alpine \
                        sh -c "npm install && npm test"
                    '''
                }
            }
        }

        stage('Test Lookup Module') {
            steps {
                dir('lookup') {
                    sh '''
                      /usr/bin/docker run --rm --volumes-from jenkins -w "$PWD" node:20-alpine \
                        sh -c "npm install && npm test"
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "/usr/bin/docker build -t ${env.DOCKER_REGISTRY}/finals-api:${env.TAG} -t ${env.DOCKER_REGISTRY}/finals-api:latest ./api"
                sh "/usr/bin/docker build -t ${env.DOCKER_REGISTRY}/finals-frontend:${env.TAG} -t ${env.DOCKER_REGISTRY}/finals-frontend:latest ./frontend"
                sh "/usr/bin/docker build -t ${env.DOCKER_REGISTRY}/finals-lookup:${env.TAG} -t ${env.DOCKER_REGISTRY}/finals-lookup:latest ./lookup"
            }
        }

        stage('Push to Registry') {
            steps {
                // Accepts any username and password/token dynamically configured in Jenkins credentials
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo \$DOCKER_PASSWORD | /usr/bin/docker login -u \$DOCKER_USER --password-stdin"
                    sh "/usr/bin/docker push ${env.DOCKER_REGISTRY}/finals-api:${env.TAG}"
                    sh "/usr/bin/docker push ${env.DOCKER_REGISTRY}/finals-api:latest"
                    sh "/usr/bin/docker push ${env.DOCKER_REGISTRY}/finals-frontend:${env.TAG}"
                    sh "/usr/bin/docker push ${env.DOCKER_REGISTRY}/finals-frontend:latest"
                    sh "/usr/bin/docker push ${env.DOCKER_REGISTRY}/finals-lookup:${env.TAG}"
                    sh "/usr/bin/docker push ${env.DOCKER_REGISTRY}/finals-lookup:latest"
                }
            }
        }

        stage('Deploy via Docker Compose') {
            steps {
                sh '/usr/bin/docker compose down || docker compose down'
                sh '/usr/bin/docker compose up -d || docker compose up -d'
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                  for i in $(seq 1 12); do
                    if /usr/bin/docker run --rm --network host curlimages/curl -f http://localhost:3080/health; then
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