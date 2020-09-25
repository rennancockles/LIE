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

				sh "sudo docker-compose stop"
            }
        }

        stage('Deploy') {
            steps {
				sh "sudo docker compose up -d"
            }
        }
    }
}