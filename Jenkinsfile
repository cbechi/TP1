pipeline {
    agent any

    environment {
        IMAGE_NAME = "ml-scraper"
        DOCKERHUB_USER = "charlie6ix"
        VERSION = "v1.${BUILD_NUMBER}"
    }

    stages {
        stage('Clonar código') {
            steps {
                git 'https://github.com/cbechi/TP1.git'
            }
        }

        stage('Construir imagen Docker') {
            steps {
                script {
                    docker.withTool('docker') {
                        sh "docker build -t ${DOCKERHUB_USER}/${IMAGE_NAME}:${VERSION} ."
                    }
                }
            }
        }

        stage('Eliminar contenedor anterior si existe') {
            steps {
                script {
                    docker.withTool('docker') {
                        sh "docker rm -f ${IMAGE_NAME} || true"
                    }
                }
            }
        }

        stage('Ejecutar contenedor') {
            steps {
                script {
                    docker.withTool('docker') {
                        sh "docker run -dit --name ${IMAGE_NAME} ${DOCKERHUB_USER}/${IMAGE_NAME}:${VERSION}"
                    }
                }
            }
        }

        stage('Verificar ejecución') {
            steps {
                script {
                    docker.withTool('docker') {
                        sh "docker exec ${IMAGE_NAME} ls /app/index.js"
                    }
                }
            }
        }

        stage('Subir a DockerHub') {
            steps {
                script {
                    docker.withTool('docker') {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh """
                                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                                docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:${VERSION}
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Limpiando entorno...'
            script {
                docker.withTool('docker') {
                    sh "docker rm -f ${IMAGE_NAME} || true"
                }
            }
        }
    }
}
