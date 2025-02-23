pipeline {
    agent any
    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend/ssage'
    }
    stages {
        stage('Pull Source Code') {
            steps {
                echo 'Pulling source code from GitHub...'
                git url: 'https://github.com/zion0425/ssage.git', branch: 'main', credentialsId: 'root'
            }
        }
        stage('Check Changes') {
            steps {
                script {
                    echo 'Checking for changes in frontend and backend...'
                    def changes = sh(script: "git diff --name-only \$(git rev-parse HEAD~1) \$(git rev-parse HEAD)", returnStdout: true).trim().split('\n')
                    env.frontendChanged = changes.any { it.startsWith(FRONTEND_DIR) }.toString()
                    env.backendChanged = changes.any { it.startsWith(BACKEND_DIR) }.toString()
                    echo "Frontend changed: ${env.frontendChanged}"
                    echo "Backend changed: ${env.backendChanged}"
                }
            }
        }
        stage('Deploy Frontend') {
            when {
                expression { env.frontendChanged == 'true' }
            }
            steps {
                echo 'Deploying frontend...'
                dir('frontend') {
                    sh '''
                        sudo mkdir -p /var/www/html
                        sudo rm -rf /var/www/html/* 
                        sudo cp -r app.js index.html public styles.css /var/www/html
                        sudo chown -R www-data:www-data /var/www/html
                        sudo chmod -R 755 /var/www/html
                    '''
                }
            }
        }
        stage('Build and Deploy Backend') {
            when {
                expression { env.backendChanged == 'true' }
            }
            steps {
                echo 'Building and deploying backend...'
                dir("${BACKEND_DIR}") {
                    sh '''
                        chmod +x gradlew   
                        ./gradlew clean build

                        # Docker 이미지 클린 빌드
                        docker stop backend || true
                        docker rm backend || true

                        # Docker 캐시 사용 안 함 (--no-cache)
                        docker build --no-cache -t backend .

                        docker run -d -p 8081:8081 backend backend
                    '''
                }
            }
        }
    }
    post {
        failure {
            echo 'Deployment failed!'
        }
        success {
            echo 'Deployment succeeded!'
        }
    }
}
