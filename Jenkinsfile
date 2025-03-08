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
                        npm install
                        npm run build  # output: export로 정적 빌드 완료됨

                        docker build -t ssage-frontend .
                        docker stop ssage-frontend || true
                        docker rm ssage-frontend || true
                        docker run -d -p 3000:80 --name ssage-frontend ssage-frontend
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
