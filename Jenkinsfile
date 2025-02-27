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
                    env.frontendChanged = changes.any { it.startsWith(env.FRONTEND_DIR) }.toString()
                    env.backendChanged = changes.any { it.startsWith(env.BACKEND_DIR) }.toString()
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
                dir(env.FRONTEND_DIR) {
                    sh '''
                        echo "Preparing frontend deployment..."
                        sudo mkdir -p /var/www/html
                        sudo rm -rf /var/www/html/* 

                        # 필요한 파일만 복사
                        sudo cp -r * /var/www/html
                        
                        # 권한 설정
                        sudo chown -R www-data:www-data /var/www/html
                        sudo chmod -R 755 /var/www/html

                        echo "Frontend deployment completed."
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
                dir(env.BACKEND_DIR) {
                    sh '''
                        chmod +x gradlew   
                        ./gradlew clean build --no-build-cache

                        echo "Cleaning up old Docker containers and images..."
                        docker stop ssage-backend || true
                        docker rm ssage-backend || true
                        docker rmi ssage-backend || true

                        echo "Building Docker image for backend..."
                        docker build --no-cache -t ssage-backend .

                        echo "Running backend Docker container..."
                        docker run -d -p 8081:8081 --name ssage-backend --shm-size=2g -e CHROME_BIN="/usr/bin/chromium" -e CHROME_DRIVER="/usr/local/bin/chromedriver" ssage-backend

                        echo "Backend deployment completed."
                    '''
                }
            }
        }
    }
    post {
        failure {
            echo '❌ Deployment failed! Check the logs for more details.'
        }
        success {
            echo '✅ Deployment succeeded!'
        }
    }
}
