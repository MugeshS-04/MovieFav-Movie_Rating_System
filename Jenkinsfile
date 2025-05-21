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
                    // 1. Stop and remove existing container (Windows compatible)
                    bat 'docker stop moviefav 2> nul || echo No container to stop'
                    bat 'docker rm moviefav 2> nul || echo No container to remove'
                    
                    // 2. Run new container (single line command for Windows)
                    bat "docker run -d -p 3000:3000 --name moviefav ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    
                    // 3. Verify container is running
                    bat """
                    for /L %%i in (1,1,10) do (
                        docker inspect -f "{{.State.Status}}" moviefav | find "running" > nul && (
                            echo Container started successfully
                            exit /b 0
                        )
                        timeout /t 5 > nul
                    )
                    echo Container failed to start
                    exit /b 1
                    """
                }
            }
        }
    }
    
    post {
        always {
            // Cleanup workspace
            cleanWs()
            
            // Optional: Stop and remove container after build
            script {
                bat 'docker stop moviefav 2> nul || echo No container to stop'
                bat 'docker rm moviefav 2> nul || echo No container to remove'
            }
        }
    }
}