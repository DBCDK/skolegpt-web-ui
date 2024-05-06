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
				script {
				image = docker.build("docker-ai.artifacts.dbccloud.dk/skolegpt-web-ui:${DOCKER_TAG}", "--no-cache .")
				image.push()
				if(env.BRANCH_NAME == "main") {
					image.push("latest")
					}
				}
			}
		}
		stage("update staging version number for staging") {
			agent {
				docker {
					label workerNode
					image "docker-dbc.artifacts.dbccloud.dk/build-env"
					alwaysPull true
				}
			}
			when {
				branch "main"
			}
			steps {
				dir("deploy") {
					sh "set-new-version skolegpt-web-ui-1-0.yml ${env.GITLAB_PRIVATE_TOKEN} ai/skolegpt-web-ui-secrets ${env.DOCKER_TAG} -b staging"
				}
				build job: "ai/SkoleGPT/skolegpt-web-ui-deploy/staging", wait: true
			}
		}
		stage("update version number for prod") {
			agent {
				docker {
					label workerNode
					image "docker-dbc.artifacts.dbccloud.dk/build-env"
					alwaysPull true
				}
			}
			when {
				branch "main"
			}
			steps {
				dir("deploy") {
					sh "set-new-version skolegpt-web-ui-1-0.yml ${env.GITLAB_PRIVATE_TOKEN} ai/skolegpt-web-ui-secrets ${env.DOCKER_TAG} -b prod"
				}
				build job: "ai/SkoleGPT/skolegpt-web-ui-deploy/prod", wait: true
			}
		}
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
