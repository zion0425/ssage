pipeline {
    agent any
    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend/ssage/ssage'
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
                        mkdir -p /var/www/html
                        cp -r app.js index.html public styles.css /var/www/html
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
                    ./gradlew build
                    docker stop ssage-backend || true
                    docker rm ssage-backend || true
                    docker build -t ssage-backend .
                    docker run -d -p 8080:8080 --name ssage-backend ssage-backend
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
