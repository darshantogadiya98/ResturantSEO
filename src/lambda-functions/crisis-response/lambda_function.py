import json
import boto3
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

class CrisisResponseService:
    def __init__(self):
        self.bedrock = boto3.client('bedrock-runtime')
        self.rds = boto3.client('rds-data')
        self.lambda_client = boto3.client('lambda')
        self.s3 = boto3.client('s3')
        self.secrets = boto3.client('secretsmanager')

        # Environment variables
        self.rds_cluster_arn = os.environ.get('RDS_CLUSTER_ARN')
        self.rds_secret_arn = os.environ.get('RDS_SECRET_ARN')
        self.rds_database = os.environ.get('RDS_DATABASE', 'restaurantguard')
        self.s3_bucket = os.environ.get('S3_BUCKET')
        self.bedrock_agent_id = os.environ.get('BEDROCK_AGENT_ID')
        self.secrets_arn = os.environ.get('SECRETS_ARN')

    def lambda_handler(self, event, context):
        """Main Lambda handler for crisis response"""
        logger.info(f"Crisis response triggered: {event}")

        try:
            # Parse event data
            if 'body' in event:
                crisis_data = json.loads(event['body'])
            else:
                crisis_data = event

            restaurant_id = crisis_data['restaurantId']
            crisis_type = crisis_data['crisisType']
            severity = crisis_data['severity']

            logger.info(f"Processing crisis for restaurant {restaurant_id}: {crisis_type} (severity: {severity})")

            # Generate recovery plan using Bedrock
            recovery_plan = self.generate_recovery_plan(crisis_data)

            # Execute recovery actions
            execution_results = self.execute_recovery_actions(recovery_plan)

            # Log crisis event and response
            crisis_event_id = self.log_crisis_event(restaurant_id, crisis_data, recovery_plan, execution_results)

            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Crisis response executed successfully',
                    'crisisEventId': crisis_event_id,
                    'recoveryPlan': recovery_plan,
                    'executionResults': execution_results,
                    'timestamp': datetime.utcnow().isoformat()
                })
            }

        except Exception as e:
            logger.error(f"Crisis response error: {str(e)}", exc_info=True)
            return {
                'statusCode': 500,
                'body': json.dumps({
                    'error': str(e),
                    'timestamp': datetime.utcnow().isoformat()
                })
            }

    def generate_recovery_plan(self, crisis_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive recovery plan using Bedrock"""

        prompt = f"""
        Restaurant Crisis Analysis and Recovery Plan Generation:

        Restaurant ID: {crisis_data['restaurantId']}
        Crisis Type: {crisis_data['crisisType']}
        Severity: {crisis_data['severity']}

        Current Situation:
        - Affected Metrics: {json.dumps(crisis_data.get('affectedMetrics', {}), indent=2)}
        - Current Performance: {json.dumps(crisis_data.get('currentMetrics', {}), indent=2)}
        - Historical Baseline: {json.dumps(crisis_data.get('baseline', {}), indent=2)}

        Generate a comprehensive recovery plan with the following structure:
        1. Immediate Actions (0-2 hours) - Critical fixes that must be implemented immediately
        2. Short-term Actions (2-24 hours) - Important optimizations and improvements
        3. Long-term Actions (1-7 days) - Strategic improvements and monitoring
        4. Success Metrics - Specific KPIs to track recovery progress
        5. Estimated Timeline - Expected recovery timeframe
        6. Risk Assessment - Potential complications and mitigation strategies

        For each action, include:
        - Action type (technical_seo_fix, content_optimization, review_response, gmb_update, etc.)
        - Priority level (critical, high, medium, low)
        - Estimated execution time
        - Expected impact on recovery
        - Specific parameters needed for execution

        Format the response as valid JSON with clear structure.
        """

        try:
            response = self.bedrock.invoke_model(
                modelId='amazon.nova-pro-v1:0',
                body=json.dumps({
                    'inputText': prompt,
                    'textGenerationConfig': {
                        'maxTokenCount': 4000,
                        'temperature': 0.3,
                        'topP': 0.9
                    }
                })
            )

            result = json.loads(response['body'].read())
            recovery_plan = json.loads(result['outputText'])

            # Validate and enhance the recovery plan
            recovery_plan = self.validate_and_enhance_plan(recovery_plan, crisis_data)

            return recovery_plan

        except Exception as e:
            logger.error(f"Error generating recovery plan: {str(e)}")
            # Fallback to predefined recovery plans
            return self.get_fallback_recovery_plan(crisis_data['crisisType'], crisis_data['severity'])

    def validate_and_enhance_plan(self, plan: Dict[str, Any], crisis_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and enhance the generated recovery plan"""

        # Ensure required structure
        if 'immediateActions' not in plan:
            plan['immediateActions'] = []
        if 'shortTermActions' not in plan:
            plan['shortTermActions'] = []
        if 'longTermActions' not in plan:
            plan['longTermActions'] = []
        if 'successMetrics' not in plan:
            plan['successMetrics'] = []

        # Add crisis-specific enhancements
        crisis_type = crisis_data['crisisType']
        severity = crisis_data['severity']

        if crisis_type == 'website_down' and severity == 'critical':
            # Ensure immediate website monitoring is included
            plan['immediateActions'].insert(0, {
                'type': 'technical_seo_fix',
                'subtype': 'website_monitoring',
                'priority': 'critical',
                'description': 'Implement immediate website monitoring and alerting',
                'estimatedTime': '15 minutes',
                'parameters': {
                    'restaurantId': crisis_data['restaurantId'],
                    'monitoringInterval': 60  # seconds
                }
            })

        # Add timestamp and metadata
        plan['generatedAt'] = datetime.utcnow().isoformat()
        plan['crisisType'] = crisis_type
        plan['severity'] = severity
        plan['restaurantId'] = crisis_data['restaurantId']

        return plan

    def execute_recovery_actions(self, recovery_plan: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Execute the recovery actions from the plan"""

        execution_results = []

        # Execute immediate actions first
        for action in recovery_plan.get('immediateActions', []):
            try:
                result = self.execute_single_action(action)
                execution_results.append({
                    'action': action,
                    'status': 'success',
                    'result': result,
                    'timestamp': datetime.utcnow().isoformat(),
                    'executionTime': result.get('executionTime', 0)
                })
                logger.info(f"Successfully executed action: {action['type']}")

            except Exception as e:
                logger.error(f"Failed to execute action {action['type']}: {str(e)}")
                execution_results.append({
                    'action': action,
                    'status': 'failed',
                    'error': str(e),
                    'timestamp': datetime.utcnow().isoformat()
                })

        # Schedule short-term actions
        self.schedule_short_term_actions(recovery_plan.get('shortTermActions', []))

        # Schedule long-term monitoring
        self.schedule_long_term_monitoring(recovery_plan.get('longTermActions', []))

        return execution_results

    def execute_single_action(self, action: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a single recovery action"""

        action_type = action['type']
        action_subtype = action.get('subtype', '')

        if action_type == 'technical_seo_fix':
            return self.invoke_lambda('restaurantguard-technical-seo', action)
        elif action_type == 'content_optimization':
            return self.invoke_lambda('restaurantguard-content-optimization', action)
        elif action_type == 'review_response':
            return self.invoke_lambda('restaurantguard-review-management', action)
        elif action_type == 'gmb_update':
            return self.invoke_lambda('restaurantguard-gmb-management', action)
        elif action_type == 'competitor_analysis':
            return self.perform_competitor_analysis(action)
        elif action_type == 'monitoring_adjustment':
            return self.adjust_monitoring_frequency(action)
        else:
            raise ValueError(f"Unknown action type: {action_type}")

    def invoke_lambda(self, function_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Invoke another Lambda function"""

        try:
            response = self.lambda_client.invoke(
                FunctionName=function_name,
                InvocationType='RequestResponse',
                Payload=json.dumps(payload)
            )

            result = json.loads(response['Payload'].read())

            if response.get('StatusCode') != 200:
                raise Exception(f"Lambda invocation failed: {result}")

            return result

        except Exception as e:
            logger.error(f"Error invoking Lambda {function_name}: {str(e)}")
            raise

    def perform_competitor_analysis(self, action: Dict[str, Any]) -> Dict[str, Any]:
        """Perform competitor analysis during crisis"""

        restaurant_id = action['parameters']['restaurantId']

        try:
            # Get competitor data from database
            competitors = self.get_restaurant_competitors(restaurant_id)

            analysis_results = []
            for competitor in competitors:
                # Analyze competitor's recent activities
                competitor_analysis = self.analyze_competitor_activity(competitor)
                analysis_results.append(competitor_analysis)

            return {
                'competitorsAnalyzed': len(competitors),
                'findings': analysis_results,
                'recommendations': self.generate_competitor_recommendations(analysis_results),
                'executionTime': 120  # 2 minutes
            }

        except Exception as e:
            logger.error(f"Competitor analysis failed: {str(e)}")
            raise

    def adjust_monitoring_frequency(self, action: Dict[str, Any]) -> Dict[str, Any]:
        """Adjust monitoring frequency during crisis"""

        restaurant_id = action['parameters']['restaurantId']
        new_frequency = action['parameters'].get('frequency', 'every_5_minutes')

        try:
            # Update monitoring configuration in database
            update_query = """
                UPDATE restaurants
                SET monitoring_config = JSON_SET(monitoring_config, '$.crisis_mode', true, '$.frequency', ?)
                WHERE id = ?
            """

            self.rds.execute_statement(
                resourceArn=self.rds_cluster_arn,
                secretArn=self.rds_secret_arn,
                database=self.rds_database,
                sql=update_query,
                parameters=[
                    {'name': 'frequency', 'value': {'stringValue': new_frequency}},
                    {'name': 'id', 'value': {'stringValue': restaurant_id}}
                ]
            )

            return {
                'frequencyUpdated': new_frequency,
                'crisisModeEnabled': True,
                'executionTime': 5
            }

        except Exception as e:
            logger.error(f"Failed to adjust monitoring frequency: {str(e)}")
            raise

    def schedule_short_term_actions(self, actions: List[Dict[str, Any]]) -> None:
        """Schedule short-term actions to be executed later"""

        for action in actions:
            try:
                # Calculate execution time (2-24 hours from now)
                delay_hours = action.get('delayHours', 2)
                execution_time = datetime.utcnow() + timedelta(hours=delay_hours)

                # Store action for later execution
                self.store_scheduled_action(action, execution_time)

            except Exception as e:
                logger.error(f"Failed to schedule action: {str(e)}")

    def schedule_long_term_monitoring(self, actions: List[Dict[str, Any]]) -> None:
        """Schedule long-term monitoring and actions"""

        for action in actions:
            try:
                # Calculate execution time (1-7 days from now)
                delay_days = action.get('delayDays', 1)
                execution_time = datetime.utcnow() + timedelta(days=delay_days)

                # Store action for later execution
                self.store_scheduled_action(action, execution_time)

            except Exception as e:
                logger.error(f"Failed to schedule long-term action: {str(e)}")

    def log_crisis_event(self, restaurant_id: str, crisis_data: Dict[str, Any],
                        recovery_plan: Dict[str, Any], execution_results: List[Dict[str, Any]]) -> str:
        """Log the crisis event and response to database"""

        try:
            insert_query = """
                INSERT INTO crisis_events
                (restaurant_id, crisis_type, severity, detection_data, response_plan, actions_taken, resolution_status)
                VALUES (?, ?, ?, ?, ?, ?, 'in_progress')
            """

            crisis_event_response = self.rds.execute_statement(
                resourceArn=self.rds_cluster_arn,
                secretArn=self.rds_secret_arn,
                database=self.rds_database,
                sql=insert_query,
                parameters=[
                    {'name': 'restaurant_id', 'value': {'stringValue': restaurant_id}},
                    {'name': 'crisis_type', 'value': {'stringValue': crisis_data['crisisType']}},
                    {'name': 'severity', 'value': {'stringValue': crisis_data['severity']}},
                    {'name': 'detection_data', 'value': {'stringValue': json.dumps(crisis_data)}},
                    {'name': 'response_plan', 'value': {'stringValue': json.dumps(recovery_plan)}},
                    {'name': 'actions_taken', 'value': {'stringValue': json.dumps(execution_results)}}
                ]
            )

            # Get the generated crisis event ID
            crisis_event_id = crisis_event_response.get('generatedFields', [{}])[0].get('longValue')

            logger.info(f"Crisis event logged with ID: {crisis_event_id}")
            return str(crisis_event_id)

        except Exception as e:
            logger.error(f"Failed to log crisis event: {str(e)}")
            raise

    def store_scheduled_action(self, action: Dict[str, Any], execution_time: datetime) -> None:
        """Store an action for scheduled execution"""

        try:
            # Store in S3 for scheduled execution
            key = f"scheduled-actions/{execution_time.strftime('%Y/%m/%d')}/{execution_time.isoformat()}-{action['type']}.json"

            self.s3.put_object(
                Bucket=self.s3_bucket,
                Key=key,
                Body=json.dumps({
                    'action': action,
                    'scheduledFor': execution_time.isoformat(),
                    'status': 'scheduled'
                }),
                ContentType='application/json'
            )

        except Exception as e:
            logger.error(f"Failed to store scheduled action: {str(e)}")

    def get_restaurant_competitors(self, restaurant_id: str) -> List[Dict[str, Any]]:
        """Get competitors for a restaurant"""

        query = """
            SELECT competitor_data
            FROM restaurants
            WHERE id = ?
        """

        try:
            result = self.rds.execute_statement(
                resourceArn=self.rds_cluster_arn,
                secretArn=self.rds_secret_arn,
                database=self.rds_database,
                sql=query,
                parameters=[
                    {'name': 'id', 'value': {'stringValue': restaurant_id}}
                ]
            )

            if result['records']:
                competitor_data = json.loads(result['records'][0][0]['stringValue'] or '{"competitors": []}')
                return competitor_data.get('competitors', [])

            return []

        except Exception as e:
            logger.error(f"Failed to get competitors: {str(e)}")
            return []

    def analyze_competitor_activity(self, competitor: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze recent competitor activity"""

        # This would include analysis of competitor rankings, content updates, etc.
        # For now, return a placeholder structure
        return {
            'competitorName': competitor.get('name', 'Unknown'),
            'recentActivity': 'analysis_pending',
            'rankingChanges': [],
            'contentUpdates': [],
            'threatLevel': 'medium'
        }

    def generate_competitor_recommendations(self, analysis_results: List[Dict[str, Any]]) -> List[str]:
        """Generate recommendations based on competitor analysis"""

        recommendations = []

        for analysis in analysis_results:
            if analysis.get('threatLevel') == 'high':
                recommendations.append(f"Monitor {analysis['competitorName']} closely for aggressive SEO activities")

        if not recommendations:
            recommendations.append("Continue standard competitive monitoring")

        return recommendations

    def get_fallback_recovery_plan(self, crisis_type: str, severity: str) -> Dict[str, Any]:
        """Get a predefined fallback recovery plan"""

        fallback_plans = {
            'website_down': {
                'immediateActions': [
                    {
                        'type': 'technical_seo_fix',
                        'subtype': 'website_diagnosis',
                        'priority': 'critical',
                        'description': 'Diagnose and fix website availability issues',
                        'estimatedTime': '30 minutes'
                    }
                ],
                'shortTermActions': [
                    {
                        'type': 'monitoring_adjustment',
                        'priority': 'high',
                        'description': 'Increase monitoring frequency',
                        'delayHours': 1
                    }
                ],
                'longTermActions': [
                    {
                        'type': 'technical_seo_fix',
                        'subtype': 'infrastructure_review',
                        'priority': 'medium',
                        'description': 'Review hosting infrastructure for reliability',
                        'delayDays': 1
                    }
                ]
            },
            'ranking_drop': {
                'immediateActions': [
                    {
                        'type': 'competitor_analysis',
                        'priority': 'high',
                        'description': 'Analyze competitor activities that may have caused ranking drop',
                        'estimatedTime': '60 minutes'
                    }
                ],
                'shortTermActions': [
                    {
                        'type': 'content_optimization',
                        'priority': 'high',
                        'description': 'Optimize content for affected keywords',
                        'delayHours': 4
                    }
                ],
                'longTermActions': [
                    {
                        'type': 'content_optimization',
                        'subtype': 'content_strategy_review',
                        'priority': 'medium',
                        'description': 'Review and update overall content strategy',
                        'delayDays': 3
                    }
                ]
            }
        }

        plan = fallback_plans.get(crisis_type, {
            'immediateActions': [],
            'shortTermActions': [],
            'longTermActions': []
        })

        plan['generatedAt'] = datetime.utcnow().isoformat()
        plan['source'] = 'fallback'
        plan['crisisType'] = crisis_type
        plan['severity'] = severity

        return plan

# Lambda handler function
def lambda_handler(event, context):
    crisis_service = CrisisResponseService()
    return crisis_service.lambda_handler(event, context)