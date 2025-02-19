pipeline {
		// 어떤 jenkins 에이전트든 실행 가능
    agent any

    stages {
		    // 
        stage('Checkout') {
            steps {
          		  // credentialId '{github credential id}'
                git url: 'https://github.com/zion0425/ssage.git', branch: 'main', credentialsId: 'root'
            }
        }
    }
}

