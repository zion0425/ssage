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
                expression { return frontendChanged }
            }
            steps {
                echo 'Deploying frontend...'
                dir('frontend') {
                    sh '''
                        sudo mkdir -p /var/www/html
                        sudo rm -rf /var/www/html/* # 기존 파일 삭제
                        sudo cp -r app.js index.html public styles.css /var/www/html
                        sudo chown -R www-data:www-data /var/www/html
                        sudo chmod -R 755 /var/www/html
                        ls -al /var/www/html # 파일 복사 확인
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
                sh '''
                    cd ${BACKEND_DIR}
                    chmod +x gradlew   # 실행 권한 추가
                    ./gradlew build
                    docker stop ssage-backend || true
                    docker rm ssage-backend || true
                    docker build -t ssage-backend .
                    docker run -d -p 8081:8081 --name ssage-backend ssage-backend
                '''
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
