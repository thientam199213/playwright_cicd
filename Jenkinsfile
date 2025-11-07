pipeline {
    agent any

    tools {
        // Use the NodeJS version you added in Jenkins > Manage Jenkins > Tools
        nodejs "node18"
    }

    environment {
        // optional environment variables
        PLAYWRIGHT_BROWSERS_PATH = "0"
        CI = "true"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out source code..."
                git branch: 'main', url: 'https://github.com/your-username/your-repo.git'
            }
        }

        stage('Install dependencies') {
            steps {
                echo "Installing dependencies..."
                sh 'npm ci'
            }
        }

        stage('Install Playwright browsers') {
            steps {
                echo "Installing Playwright browsers..."
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Playwright tests') {
            steps {
                echo "Running Playwright tests..."
                // Use headless mode for CI
                sh 'npx playwright test --reporter=html'
            }
        }

        stage('Archive HTML report') {
            steps {
                echo "Archiving Playwright report..."
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Cleaning workspace..."
            cleanWs()
        }
        success {
            echo "✅ Tests completed successfully!"
        }
        failure {
            echo "❌ Some tests failed. Check the HTML report for details."
        }
    }
}
