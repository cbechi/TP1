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
                sh "docker build -t ${DOCKERHUB_USER}/${IMAGE_NAME}:${VERSION} ."
            }
        }

        stage('Eliminar contenedor anterior si existe') {
            steps {
                sh """
                    docker rm -f ${IMAGE_NAME} || true
                """
            }
        }

        stage('Ejecutar contenedor') {
            steps {
                sh "docker run -dit --name ${IMAGE_NAME} ${DOCKERHUB_USER}/${IMAGE_NAME}:${VERSION}"
            }
        }

        stage('Verificar ejecución') {
            steps {
                sh "docker exec ${IMAGE_NAME} ls /app/index.js"
                // También podés agregar: docker exec ... node index.js ibanez
            }
        }

        stage('Subir a DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:${VERSION}
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Limpiando entorno...'
            sh "docker rm -f ${IMAGE_NAME} || true"
        }
    }
}
