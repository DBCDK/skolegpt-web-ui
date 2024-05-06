#! groovy
@Library('ai') _
def workerNode = "devel11"
def slackReceivers = "#ai-jenkins-warnings"

pipeline {
	agent { label workerNode }
	environment {
		DOCKER_TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
		GITLAB_PRIVATE_TOKEN = credentials("ai-gitlab-api-token")
	}
    triggers {
        pollSCM("H/06 * * * *")
    }
    stages {
		stage("docker build") {
			steps {
                buildImage()
			}
		}
		// stage("update staging version number for staging") {
		// 	agent {
		// 		docker {
		// 			label workerNode
		// 			image "docker.dbc.dk/build-env"
		// 			alwaysPull true
		// 		}
		// 	}
		// 	when {
		// 		branch "master"
		// 	}
		// 	steps {
		// 		dir("deploy") {
		// 			sh "set-new-version simple-suggest-1-1.yml ${env.GITLAB_PRIVATE_TOKEN} ai/simple-suggest-secrets ${env.DOCKER_TAG} -b staging"
		// 		}
		// 		build job: "ai/simple-suggest/simple-suggest-deploy/staging", wait: true
		// 	}
		// }
		// stage("validate staging") {
		// 	agent {
		// 		docker {
		// 			label workerNode
		// 			image "docker.dbc.dk/build-env"
		// 			alwaysPull true
		// 		}
		// 	}
		// 	when {
		// 		branch "master"
		// 	}
		// 	steps {
		// 		sh "webservice-validation http://simple-suggest-1-1.mi-staging.svc.cloud.dbc.dk deploy/validation.yml"
		// 	}
		// }
		// stage("update version number for prod") {
		// 	agent {
		// 		docker {
		// 			label workerNode
		// 			image "docker.dbc.dk/build-env"
		// 			alwaysPull true
		// 		}
		// 	}
		// 	when {
		// 		branch "master"
		// 	}
		// 	steps {
		// 		dir("deploy") {
		// 			sh "set-new-version simple-suggest-1-1.yml ${env.GITLAB_PRIVATE_TOKEN} ai/simple-suggest-secrets ${env.DOCKER_TAG} -b prod"
		// 		}
		// 		build job: "ai/simple-suggest/simple-suggest-deploy/prod", wait: true
		// 	}
		// }
		// stage("validate prod") {
		// 	agent {
		// 		docker {
		// 			label workerNode
		// 			image "docker.dbc.dk/build-env"
		// 			alwaysPull true
		// 		}
		// 	}
		// 	when {
		// 		branch "master"
		// 	}
		// 	steps {
		// 		sh "webservice-validation http://simple-suggest-1-1.mi-prod.svc.cloud.dbc.dk deploy/validation.yml"
		// 	}
		// }
    }
	// post {
	// 	unstable {
	// 		slackSend message: "build became unstable for ${env.JOB_NAME}: ${env.BUILD_URL}", channel: slackReceivers
	// 	}
	// 	failure {
	// 		slackSend message: "build failed for ${env.JOB_NAME}: ${env.BUILD_URL}", channel: slackReceivers
	// 	}
	// }
}
