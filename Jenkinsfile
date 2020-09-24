pipeline {
    agent any

    environment {
        DOCKER_NAME = 'lie'
        VUE_APP_STORE_IDS = '["366444","1371889"]'
    }

    stages {    
        stage('Checkout') {
            steps {
				git credentialsId: 'github', url: 'https://github.com/rennancockles/LIE.git'
            }
        }

        stage('Prepare') {
            steps {
				sh """
				    echo "VUE_APP_STORE_IDS=${env.VUE_APP_STORE_IDS}" > .env
				"""

				sh "sudo docker stop ${env.DOCKER_NAME} && sudo docker rm ${env.DOCKER_NAME} || echo Skipping Prepare Stage"
            }
        }

        stage('Build') {
            steps {
				sh "sudo docker build -t ${env.DOCKER_NAME}:latest ."
            }
        }

        stage('Run') {
            steps {
				sh "sudo docker run -d -p 8951:80 --name ${env.DOCKER_NAME} --restart=always ${env.DOCKER_NAME}:latest"
            }
        }
    }
}