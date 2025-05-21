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
                bat 'npm test || exit 0'
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
                    // 1. Stop container silently
                    bat 'docker stop moviefav 2> nul'
                    
                    // 2. Remove container silently
                    bat 'docker rm moviefav 2> nul'
                    
                    // 3. Run new container (single line)
                    bat "docker run -d -p 3000:3000 --name moviefav ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    
                    // 4. Verify deployment
                    bat """
                    @echo off
                    set max_retries=10
                    set retry_delay=5
                    set retry_count=0
                    
                    :check_container
                    docker inspect -f "{{.State.Status}}" moviefav 2> nul | find "running" > nul
                    if %errorlevel% equ 0 (
                        echo Container is running
                        exit /b 0
                    )
                    
                    set /a retry_count+=1
                    if %retry_count% geq %max_retries% (
                        echo Container failed to start after %max_retries% attempts
                        exit /b 1
                    )
                    
                    timeout /t %retry_delay% > nul
                    goto check_container
                    """
                }
            }
        }
    }
    
    post {
        always {
            // Silent cleanup
            bat '@docker stop moviefav 2> nul & docker rm moviefav 2> nul'
            cleanWs()
        }
    }
}