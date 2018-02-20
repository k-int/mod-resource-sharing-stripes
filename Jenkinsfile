node {
  stage ('Checkout the code') {
    checkout scm
  }
  
  stage ('Build the module') {
    // Just execute the yarn commands.
    sh '''
      yarn install
      yarn build
    '''
  }
}