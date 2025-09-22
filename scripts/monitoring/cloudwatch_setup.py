#!/usr/bin/env python3
"""
CloudWatch monitoring setup for RestaurantGuard AI Agent
Creates custom metrics, alarms, and dashboards
"""

import boto3
import json
import logging
import os
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class MonitoringSetup:
    def __init__(self):
        self.cloudwatch = boto3.client('cloudwatch')
        self.sns = boto3.client('sns')
        self.lambda_client = boto3.client('lambda')

        self.aws_region = os.environ.get('AWS_REGION', 'us-east-1')
        self.environment = os.environ.get('ENVIRONMENT', 'prod')
        self.project_name = os.environ.get('PROJECT_NAME', 'restaurantguard')

    def create_sns_topic(self):
        """Create SNS topic for alerts"""
        topic_name = f"{self.project_name}-alerts-{self.environment}"

        try:
            response = self.sns.create_topic(Name=topic_name)
            topic_arn = response['TopicArn']

            # Set topic attributes
            self.sns.set_topic_attributes(
                TopicArn=topic_arn,
                AttributeName='DisplayName',
                AttributeValue='RestaurantGuard Alerts'
            )

            logger.info(f"Created SNS topic: {topic_arn}")
            return topic_arn

        except Exception as e:
            logger.error(f"Failed to create SNS topic: {e}")
            raise

    def create_custom_metrics(self):
        """Create custom CloudWatch metrics for the application"""

        metrics = [
            {
                'MetricName': 'CrisisDetected',
                'Namespace': 'RestaurantGuard/Crisis',
                'Dimensions': [
                    {'Name': 'CrisisType', 'Value': 'all'},
                    {'Name': 'Environment', 'Value': self.environment}
                ],
                'Unit': 'Count'
            },
            {
                'MetricName': 'CrisisResolutionTime',
                'Namespace': 'RestaurantGuard/Performance',
                'Dimensions': [
                    {'Name': 'CrisisType', 'Value': 'all'},
                    {'Name': 'Environment', 'Value': self.environment}
                ],
                'Unit': 'Seconds'
            },
            {
                'MetricName': 'ActionExecutionSuccess',
                'Namespace': 'RestaurantGuard/Actions',
                'Dimensions': [
                    {'Name': 'ActionType', 'Value': 'all'},
                    {'Name': 'Environment', 'Value': self.environment}
                ],
                'Unit': 'Count'
            },
            {
                'MetricName': 'RestaurantsMonitored',
                'Namespace': 'RestaurantGuard/Business',
                'Dimensions': [
                    {'Name': 'Environment', 'Value': self.environment}
                ],
                'Unit': 'Count'
            },
            {
                'MetricName': 'SEORankingImprovement',
                'Namespace': 'RestaurantGuard/SEO',
                'Dimensions': [
                    {'Name': 'Environment', 'Value': self.environment}
                ],
                'Unit': 'Count'
            }
        ]

        try:
            for metric in metrics:
                self.cloudwatch.put_metric_data(
                    Namespace=metric['Namespace'],
                    MetricData=[{
                        'MetricName': metric['MetricName'],
                        'Value': 0,
                        'Unit': metric['Unit'],
                        'Dimensions': metric['Dimensions'],
                        'Timestamp': datetime.utcnow()
                    }]
                )

            logger.info(f"Created {len(metrics)} custom metrics")

        except Exception as e:
            logger.error(f"Failed to create custom metrics: {e}")
            raise

    def create_alarms(self, sns_topic_arn):
        """Create CloudWatch alarms for system monitoring"""

        alarms = [
            {
                'AlarmName': f'{self.project_name}-high-error-rate-{self.environment}',
                'ComparisonOperator': 'GreaterThanThreshold',
                'EvaluationPeriods': 2,
                'MetricName': 'Errors',
                'Namespace': 'AWS/Lambda',
                'Period': 300,
                'Statistic': 'Sum',
                'Threshold': 10.0,
                'ActionsEnabled': True,
                'AlarmActions': [sns_topic_arn],
                'AlarmDescription': 'High error rate in Lambda functions',
                'Dimensions': [
                    {
                        'Name': 'FunctionName',
                        'Value': f'{self.project_name}-monitoring'
                    }
                ],
                'TreatMissingData': 'notBreaching'
            },
            {
                'AlarmName': f'{self.project_name}-high-duration-{self.environment}',
                'ComparisonOperator': 'GreaterThanThreshold',
                'EvaluationPeriods': 3,
                'MetricName': 'Duration',
                'Namespace': 'AWS/Lambda',
                'Period': 300,
                'Statistic': 'Average',
                'Threshold': 30000.0,  # 30 seconds
                'ActionsEnabled': True,
                'AlarmActions': [sns_topic_arn],
                'AlarmDescription': 'High Lambda function duration',
                'Dimensions': [
                    {
                        'Name': 'FunctionName',
                        'Value': f'{self.project_name}-monitoring'
                    }
                ],
                'TreatMissingData': 'notBreaching'
            },
            {
                'AlarmName': f'{self.project_name}-database-connections-{self.environment}',
                'ComparisonOperator': 'GreaterThanThreshold',
                'EvaluationPeriods': 2,
                'MetricName': 'DatabaseConnections',
                'Namespace': 'AWS/RDS',
                'Period': 300,
                'Statistic': 'Average',
                'Threshold': 80.0,
                'ActionsEnabled': True,
                'AlarmActions': [sns_topic_arn],
                'AlarmDescription': 'High database connection usage',
                'Dimensions': [
                    {
                        'Name': 'DBInstanceIdentifier',
                        'Value': f'{self.project_name}-db'
                    }
                ],
                'TreatMissingData': 'notBreaching'
            },
            {
                'AlarmName': f'{self.project_name}-crisis-resolution-time-{self.environment}',
                'ComparisonOperator': 'GreaterThanThreshold',
                'EvaluationPeriods': 1,
                'MetricName': 'CrisisResolutionTime',
                'Namespace': 'RestaurantGuard/Performance',
                'Period': 300,
                'Statistic': 'Average',
                'Threshold': 1800.0,  # 30 minutes
                'ActionsEnabled': True,
                'AlarmActions': [sns_topic_arn],
                'AlarmDescription': 'Crisis resolution taking too long',
                'Dimensions': [
                    {
                        'Name': 'Environment',
                        'Value': self.environment
                    }
                ],
                'TreatMissingData': 'notBreaching'
            },
            {
                'AlarmName': f'{self.project_name}-monitoring-failures-{self.environment}',
                'ComparisonOperator': 'GreaterThanThreshold',
                'EvaluationPeriods': 2,
                'MetricName': 'Errors',
                'Namespace': 'AWS/Lambda',
                'Period': 900,  # 15 minutes
                'Statistic': 'Sum',
                'Threshold': 3.0,
                'ActionsEnabled': True,
                'AlarmActions': [sns_topic_arn],
                'AlarmDescription': 'Monitoring service failures',
                'Dimensions': [
                    {
                        'Name': 'FunctionName',
                        'Value': f'{self.project_name}-monitoring'
                    }
                ],
                'TreatMissingData': 'breaching'
            }
        ]

        try:
            created_alarms = []
            for alarm in alarms:
                self.cloudwatch.put_metric_alarm(**alarm)
                created_alarms.append(alarm['AlarmName'])

            logger.info(f"Created {len(created_alarms)} CloudWatch alarms")
            return created_alarms

        except Exception as e:
            logger.error(f"Failed to create alarms: {e}")
            raise

    def create_dashboard(self):
        """Create CloudWatch dashboard for monitoring"""

        dashboard_name = f"{self.project_name}-{self.environment}"

        dashboard_body = {
            "widgets": [
                {
                    "type": "metric",
                    "x": 0,
                    "y": 0,
                    "width": 12,
                    "height": 6,
                    "properties": {
                        "metrics": [
                            ["RestaurantGuard/Crisis", "CrisisDetected", "Environment", self.environment],
                            ["RestaurantGuard/Actions", "ActionExecutionSuccess", "Environment", self.environment]
                        ],
                        "period": 300,
                        "stat": "Sum",
                        "region": self.aws_region,
                        "title": "Crisis Detection & Action Execution",
                        "yAxis": {
                            "left": {
                                "min": 0
                            }
                        }
                    }
                },
                {
                    "type": "metric",
                    "x": 12,
                    "y": 0,
                    "width": 12,
                    "height": 6,
                    "properties": {
                        "metrics": [
                            ["AWS/Lambda", "Duration", "FunctionName", f"{self.project_name}-monitoring"],
                            [".", "Invocations", ".", "."],
                            [".", "Errors", ".", "."]
                        ],
                        "period": 300,
                        "stat": "Average",
                        "region": self.aws_region,
                        "title": "Lambda Function Performance",
                        "yAxis": {
                            "left": {
                                "min": 0
                            }
                        }
                    }
                },
                {
                    "type": "metric",
                    "x": 0,
                    "y": 6,
                    "width": 12,
                    "height": 6,
                    "properties": {
                        "metrics": [
                            ["AWS/RDS", "DatabaseConnections", "DBInstanceIdentifier", f"{self.project_name}-db"],
                            [".", "CPUUtilization", ".", "."],
                            [".", "FreeableMemory", ".", "."]
                        ],
                        "period": 300,
                        "stat": "Average",
                        "region": self.aws_region,
                        "title": "Database Performance",
                        "yAxis": {
                            "left": {
                                "min": 0
                            }
                        }
                    }
                },
                {
                    "type": "metric",
                    "x": 12,
                    "y": 6,
                    "width": 12,
                    "height": 6,
                    "properties": {
                        "metrics": [
                            ["RestaurantGuard/Performance", "CrisisResolutionTime", "Environment", self.environment],
                            ["RestaurantGuard/Business", "RestaurantsMonitored", "Environment", self.environment]
                        ],
                        "period": 300,
                        "stat": "Average",
                        "region": self.aws_region,
                        "title": "Business Metrics",
                        "yAxis": {
                            "left": {
                                "min": 0
                            }
                        }
                    }
                },
                {
                    "type": "log",
                    "x": 0,
                    "y": 12,
                    "width": 24,
                    "height": 6,
                    "properties": {
                        "query": f"SOURCE '/aws/lambda/{self.project_name}-monitoring'\n| fields @timestamp, @message\n| filter @message like /ERROR/\n| sort @timestamp desc\n| limit 20",
                        "region": self.aws_region,
                        "title": "Recent Error Logs",
                        "view": "table"
                    }
                }
            ]
        }

        try:
            self.cloudwatch.put_dashboard(
                DashboardName=dashboard_name,
                DashboardBody=json.dumps(dashboard_body)
            )

            logger.info(f"Created CloudWatch dashboard: {dashboard_name}")
            return dashboard_name

        except Exception as e:
            logger.error(f"Failed to create dashboard: {e}")
            raise

    def create_log_groups(self):
        """Create CloudWatch log groups for Lambda functions"""

        log_client = boto3.client('logs')

        log_groups = [
            f'/aws/lambda/{self.project_name}-monitoring',
            f'/aws/lambda/{self.project_name}-crisis-response',
            f'/aws/lambda/{self.project_name}-technical-seo',
            f'/aws/lambda/{self.project_name}-content-optimization',
            f'/aws/lambda/{self.project_name}-review-management',
            f'/aws/lambda/{self.project_name}-gmb-management',
            f'/aws/apigateway/{self.project_name}'
        ]

        created_groups = []

        for log_group_name in log_groups:
            try:
                log_client.create_log_group(
                    logGroupName=log_group_name,
                    tags={
                        'Project': self.project_name,
                        'Environment': self.environment,
                        'ManagedBy': 'RestaurantGuard-Setup'
                    }
                )

                # Set retention policy
                log_client.put_retention_policy(
                    logGroupName=log_group_name,
                    retentionInDays=30
                )

                created_groups.append(log_group_name)

            except log_client.exceptions.ResourceAlreadyExistsException:
                logger.info(f"Log group already exists: {log_group_name}")
            except Exception as e:
                logger.error(f"Failed to create log group {log_group_name}: {e}")

        if created_groups:
            logger.info(f"Created {len(created_groups)} log groups")

    def setup_monitoring(self):
        """Main setup method"""
        try:
            logger.info("Starting monitoring setup...")

            # Create SNS topic for alerts
            sns_topic_arn = self.create_sns_topic()

            # Create log groups
            self.create_log_groups()

            # Create custom metrics
            self.create_custom_metrics()

            # Create alarms
            alarm_names = self.create_alarms(sns_topic_arn)

            # Create dashboard
            dashboard_name = self.create_dashboard()

            logger.info("Monitoring setup completed successfully!")

            return {
                'sns_topic_arn': sns_topic_arn,
                'alarm_names': alarm_names,
                'dashboard_name': dashboard_name,
                'status': 'success'
            }

        except Exception as e:
            logger.error(f"Monitoring setup failed: {e}")
            return {
                'status': 'failed',
                'error': str(e)
            }

def main():
    """Main function"""
    try:
        setup = MonitoringSetup()
        result = setup.setup_monitoring()

        if result['status'] == 'success':
            print("\n" + "="*60)
            print("🎉 Monitoring Setup Complete!")
            print("="*60)
            print(f"📡 SNS Topic: {result['sns_topic_arn']}")
            print(f"⚠️  Alarms Created: {len(result['alarm_names'])}")
            print(f"📊 Dashboard: {result['dashboard_name']}")
            print("\n📋 Next Steps:")
            print("1. Subscribe to SNS topic for alerts")
            print("2. View dashboard in CloudWatch console")
            print("3. Test alarms with sample data")
            print("="*60)
        else:
            print(f"❌ Monitoring setup failed: {result['error']}")
            exit(1)

    except Exception as e:
        logger.error(f"Setup script failed: {e}")
        exit(1)

if __name__ == "__main__":
    main()