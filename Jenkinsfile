pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    environment {
        DOCKER_IMAGE = "mugeshs04/moviefav"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/MugeshS-04/MovieFav-Movie_Rating_System.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install' 
            }
        }
        
        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }
        
        stage('Deploy Container') {
            steps {
                script {
                    bat 'docker stop moviefav || echo "No container to stop"'
                    bat 'docker rm moviefav || echo "No container to remove"'
                    bat "docker run -d -p 3000:3000 --name moviefav ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
    }
}