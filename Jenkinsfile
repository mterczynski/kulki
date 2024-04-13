pipeline {
  agent any

  environment {
    DESTINATION = "root@mterczynski.pl:/var/www/html/kulki"
  }

  stages {
    stage('Install') {
      steps {
        sh "npm install"
      }
    }


    stage('Build') {
      steps {
        sh "npm run build"
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          scp index.html ${DESTINATION}
          scp dist/* ${DESTINATION}/dist
          scp css/* ${DESTINATION}/css
          scp assets/* ${DESTINATION}/assets
          scp README.md ${DESTINATION}
          exit
        '''
      }
    }
  }
}
