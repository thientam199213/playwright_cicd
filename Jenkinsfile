pipeline {
    agent any

    tools {
        // Use the NodeJS version you added in Jenkins > Manage Jenkins > Tools
        nodejs "node22"
    }

    environment {
        // optional environment variables
        PLAYWRIGHT_BROWSERS_PATH = "0"
        CI = "true"
    }

    triggers {
        cron('''
        0 5 * * *
        30 11 * * *
        0 20 * * *
        ''')
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out source code..."
                git branch: 'main', url: 'https://github.com/thientam199213/playwright_cicd.git'
            }
        }

        stage('Install dependencies') {
            steps {
                echo "Installing dependencies..."
                bat 'npm ci'
            }
        }

        stage('Install Playwright browsers') {
            steps {
                echo "Installing Playwright browsers..."
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Run Playwright tests') {
            steps {
                echo "Running Playwright tests..."
                // Use headless mode for CI
                bat 'npx playwright test -g "@smoke" --reporter=html'
            }
        }

        stage('Run Playwright regression tests') {
            when {
                expression { return env.RUN_REGRESSION == 'true' }
            }
            steps {
                echo "Running Playwright regression tests..."
                bat 'npx playwright test -g "@regression" --reporter=html'
            }
        }

        stage('Archive HTML report') {
            steps {
                echo "Archiving Playwright report..."
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            }
        }

        stage('Publish HTML Reports') {
            steps {
                echo "Publishing HTML reports..."
                
                // Smoke report
                publishHTML([
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report-smoke',
                    reportFiles: 'index.html',
                    reportName: 'Smoke Test Report'
                ])
                
                // Regression report
                publishHTML([
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report-regression',
                    reportFiles: 'index.html',
                    reportName: 'Regression Test Report'
                ])
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
