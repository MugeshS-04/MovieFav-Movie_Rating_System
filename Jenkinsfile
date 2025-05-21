pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS Plugin'
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
                script {
                    bat 'npm test || exit 0'
                }
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
                    // 1. Stop container if exists (Windows-compatible error handling)
                    bat """
                    docker stop moviefav || (
                        echo No container to stop && 
                        exit /b 0
                    )
                    """
                    
                    // 2. Remove container if exists
                    bat """
                    docker rm moviefav || (
                        echo No container to remove && 
                        exit /b 0
                    )
                    """
                    
                    // 3. Run new container (will fail pipeline if this fails)
                    bat """
                    docker run -d \
                    -p 3000:3000 \
                    --name moviefav \
                    ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
    }
}