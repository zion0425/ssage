pipeline {
		// 어떤 jenkins 에이전트든 실행 가능
    agent any

    stages {
		    // 
        stage('Checkout') {
            steps {
          		  // credentialId '{github credential id}'
                git url: 'git@github.com:zion0425/jen_test.git', branch: 'main', credentialsId: 'root'
            }
        }
    }
}

