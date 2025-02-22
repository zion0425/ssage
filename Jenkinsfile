pipeline {
    agent any
    
    environment {
        FRONTEND_DIR = '/var/www/html'        // Nginx 배포 경로
        BACKEND_DIR = '/home/ubuntu/backend'  // Spring Boot 배포 경로
        BACKEND_PORT = '8081'                 // 백엔드 서비스 포트
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
                    env.CHANGED_FILES = sh(
                        script: "git diff --name-only ${GIT_PREVIOUS_SUCCESSFUL_COMMIT} ${GIT_COMMIT}",
                        returnStdout: true
                    ).trim()
                    
                    env.FRONTEND_CHANGED = sh(
                        script: "echo \"$CHANGED_FILES\" | grep -q '^frontend/' && echo 'true' || echo 'false'",
                        returnStdout: true
                    ).trim()
                    
                    env.BACKEND_CHANGED = sh(
                        script: "echo \"$CHANGED_FILES\" | grep -q '^backend/' && echo 'true' || echo 'false'",
                        returnStdout: true
                    ).trim()
                    
                    echo "Frontend changed: ${env.FRONTEND_CHANGED}"
                    echo "Backend changed: ${env.BACKEND_CHANGED}"
                }
            }
        }
                
        stage('Deploy Frontend') {
            when { expression { return frontendChanged } }
            steps {
                echo 'Deploying Frontend to Nginx...'
                sh '''
                    sudo mkdir -p /var/www/html
                    sudo rm -rf /var/www/html/*
                    sudo cp -r frontend/public/* /var/www/html
                '''
            }
        }
        
        stage('Build and Deploy Backend') {
            when {
                expression { env.BACKEND_CHANGED == 'true' }
            }
            steps {
                echo 'Building and Deploying Backend...'
                dir('backend') {
                    sh './gradlew clean build'  // Gradle 사용 시 (Maven 사용 시 'mvn clean package')
                }
                
                sh 'pkill -f "java -jar" || true'  // 기존 Spring Boot 앱 종료
                sh 'nohup java -jar backend/build/libs/*.jar --server.port=$BACKEND_PORT > backend.log 2>&1 &'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
