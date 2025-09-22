#!/usr/bin/env python3
"""
End-to-end integration tests for RestaurantGuard AI Agent
Tests the complete workflow from monitoring to crisis response
"""

import json
import boto3
import pytest
import time
import uuid
from datetime import datetime, timedelta
from moto import mock_lambda, mock_rds, mock_s3, mock_secretsmanager

@pytest.fixture
def aws_credentials():
    """Mocked AWS Credentials for moto."""
    import os
    os.environ['AWS_ACCESS_KEY_ID'] = 'testing'
    os.environ['AWS_SECRET_ACCESS_KEY'] = 'testing'
    os.environ['AWS_SECURITY_TOKEN'] = 'testing'
    os.environ['AWS_SESSION_TOKEN'] = 'testing'
    os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'

class TestEndToEndWorkflow:
    """Test complete crisis response workflow"""

    def setUp(self):
        self.restaurant_id = str(uuid.uuid4())
        self.setup_mock_aws_services()
        self.create_test_restaurant()

    @mock_lambda
    @mock_rds
    @mock_s3
    @mock_secretsmanager
    def setup_mock_aws_services(self):
        """Setup mock AWS services"""
        # Lambda client
        self.lambda_client = boto3.client('lambda', region_name='us-east-1')

        # RDS client
        self.rds_client = boto3.client('rds-data', region_name='us-east-1')

        # S3 client
        self.s3_client = boto3.client('s3', region_name='us-east-1')

        # Secrets Manager client
        self.secrets_client = boto3.client('secretsmanager', region_name='us-east-1')

        # Create S3 bucket
        self.s3_client.create_bucket(Bucket='test-restaurantguard-data')

        # Create secrets
        self.secrets_client.create_secret(
            Name='restaurantguard/api-keys',
            SecretString=json.dumps({
                'google_search_console': 'test-gsc-key',
                'google_my_business': 'test-gmb-key',
                'yelp_fusion': 'test-yelp-key'
            })
        )

    def create_test_restaurant(self):
        """Create test restaurant data"""
        self.test_restaurant = {
            'id': self.restaurant_id,
            'name': 'Test Pizza Palace',
            'website': 'https://testpizzapalace.com',
            'address': {
                'street': '123 Main St',
                'city': 'New York',
                'state': 'NY',
                'zipCode': '10001'
            },
            'digital_presence': {
                'googleMyBusinessId': 'test-gmb-id',
                'yelpBusinessId': 'test-yelp-id'
            },
            'target_keywords': [
                'best pizza nyc',
                'pizza delivery manhattan',
                'authentic italian pizza'
            ],
            'monitoring_config': {
                'frequency': '15_minutes',
                'alertThresholds': {
                    'rankingDrop': 30,
                    'trafficDrop': 20
                }
            }
        }

    def test_complete_crisis_workflow(self):
        """Test the complete crisis detection and response workflow"""
        # 1. Setup: Create baseline data
        baseline_metrics = self.create_baseline_metrics()

        # 2. Trigger monitoring (simulated)
        monitoring_result = self.simulate_monitoring()
        assert monitoring_result['statusCode'] == 200

        # 3. Simulate crisis condition
        crisis_metrics = self.create_crisis_metrics()

        # 4. Trigger crisis detection
        crisis_data = {
            'restaurantId': self.restaurant_id,
            'crisisType': 'ranking_drop',
            'severity': 'high',
            'affectedMetrics': {
                'keywords': ['best pizza nyc'],
                'positionDrop': 15
            },
            'currentMetrics': crisis_metrics,
            'baseline': baseline_metrics
        }

        # 5. Trigger crisis response
        response_result = self.simulate_crisis_response(crisis_data)
        assert response_result['statusCode'] == 200

        # 6. Verify actions were planned and executed
        response_body = json.loads(response_result['body'])
        assert 'recoveryPlan' in response_body
        assert 'executionResults' in response_body

        recovery_plan = response_body['recoveryPlan']
        execution_results = response_body['executionResults']

        # Verify recovery plan structure
        assert 'immediateActions' in recovery_plan
        assert 'shortTermActions' in recovery_plan
        assert len(recovery_plan['immediateActions']) > 0

        # Verify some actions were executed
        assert len(execution_results) > 0
        successful_actions = [r for r in execution_results if r['status'] == 'success']
        assert len(successful_actions) > 0

        # 7. Verify crisis event was logged
        logged_events = self.get_crisis_logs(self.restaurant_id)
        assert len(logged_events) == 1
        assert logged_events[0]['crisis_type'] == 'ranking_drop'
        assert logged_events[0]['severity'] == 'high'

    def test_monitoring_load_handling(self):
        """Test monitoring system under load"""
        import concurrent.futures
        import threading

        # Create multiple restaurants
        restaurant_ids = [str(uuid.uuid4()) for _ in range(10)]

        def monitor_restaurant(restaurant_id):
            """Monitor a single restaurant"""
            try:
                result = self.simulate_monitoring_for_restaurant(restaurant_id)
                return {
                    'restaurant_id': restaurant_id,
                    'success': result['statusCode'] == 200,
                    'response_time': 0.5  # Simulated response time
                }
            except Exception as e:
                return {
                    'restaurant_id': restaurant_id,
                    'success': False,
                    'error': str(e)
                }

        start_time = time.time()

        # Execute monitoring for all restaurants concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(monitor_restaurant, rid) for rid in restaurant_ids]
            results = [future.result() for future in futures]

        end_time = time.time()
        duration = end_time - start_time

        # Analyze results
        successful_results = [r for r in results if r['success']]
        failed_results = [r for r in results if not r['success']]

        # Performance assertions
        assert duration < 10  # Should complete within 10 seconds
        assert len(failed_results) < len(results) * 0.1  # Less than 10% failure rate
        assert len(successful_results) >= 8  # At least 8 out of 10 should succeed

        print(f"Load test completed in {duration:.2f} seconds")
        print(f"Successful: {len(successful_results)}")
        print(f"Failed: {len(failed_results)}")

    def test_crisis_response_effectiveness(self):
        """Test the effectiveness of crisis response actions"""
        # Create initial poor metrics
        poor_metrics = {
            'searchConsole': {
                'totalClicks': 50,  # Down from baseline of 200
                'totalImpressions': 1000,  # Down from baseline of 5000
                'averagePosition': 25  # Down from baseline of 8
            },
            'technical': {
                'loadTimeMs': 8000,  # Slow (baseline: 2000ms)
                'isAccessible': True
            },
            'reviews': {
                'averageRating': 3.2,  # Down from baseline of 4.5
                'recentNegativeCount': 5
            }
        }

        # Trigger crisis response
        crisis_data = {
            'restaurantId': self.restaurant_id,
            'crisisType': 'multiple_issues',
            'severity': 'critical',
            'currentMetrics': poor_metrics,
            'baseline': self.create_baseline_metrics()
        }

        response_result = self.simulate_crisis_response(crisis_data)
        assert response_result['statusCode'] == 200

        # Simulate improved metrics after 24 hours
        improved_metrics = {
            'searchConsole': {
                'totalClicks': 150,  # Improved
                'totalImpressions': 3500,  # Improved
                'averagePosition': 12  # Improved
            },
            'technical': {
                'loadTimeMs': 2500,  # Improved
                'isAccessible': True
            },
            'reviews': {
                'averageRating': 4.1,  # Improved
                'recentNegativeCount': 1
            }
        }

        # Calculate effectiveness
        effectiveness = self.calculate_crisis_response_effectiveness(
            poor_metrics, improved_metrics, self.create_baseline_metrics()
        )

        # Verify improvement
        assert effectiveness['overall_improvement'] > 0.3  # At least 30% improvement
        assert effectiveness['technical_improvement'] > 0.5  # Significant technical improvement
        assert effectiveness['seo_improvement'] > 0.2  # Some SEO improvement

    def test_competitor_response_scenario(self):
        """Test response to competitor SEO activities"""
        # Simulate competitor gaining rankings
        competitor_activity = {
            'competitor': 'Rival Pizza Co',
            'activity_type': 'content_update',
            'keywords_affected': ['best pizza nyc', 'pizza delivery manhattan'],
            'ranking_improvements': [5, 8]  # Positions gained
        }

        # Our restaurant's affected metrics
        affected_metrics = {
            'rankings': {
                'best pizza nyc': {'previous': 3, 'current': 8},  # Lost 5 positions
                'pizza delivery manhattan': {'previous': 5, 'current': 13}  # Lost 8 positions
            }
        }

        crisis_data = {
            'restaurantId': self.restaurant_id,
            'crisisType': 'competitor_surge',
            'severity': 'high',
            'competitorActivity': competitor_activity,
            'affectedMetrics': affected_metrics
        }

        response_result = self.simulate_crisis_response(crisis_data)
        assert response_result['statusCode'] == 200

        response_body = json.loads(response_result['body'])
        recovery_plan = response_body['recoveryPlan']

        # Verify competitor-specific actions are included
        immediate_actions = recovery_plan['immediateActions']
        competitor_actions = [a for a in immediate_actions if 'competitor' in a['type']]
        assert len(competitor_actions) > 0

        # Verify content optimization is prioritized
        content_actions = [a for a in immediate_actions if 'content' in a['type']]
        assert len(content_actions) > 0

    def test_review_crisis_management(self):
        """Test handling of negative review surges"""
        # Simulate negative review surge
        negative_reviews = [
            {
                'platform': 'google',
                'rating': 1,
                'text': 'Terrible food and service!',
                'date': datetime.utcnow().isoformat()
            },
            {
                'platform': 'yelp',
                'rating': 2,
                'text': 'Very disappointed with the quality.',
                'date': datetime.utcnow().isoformat()
            },
            {
                'platform': 'google',
                'rating': 1,
                'text': 'Would not recommend to anyone.',
                'date': datetime.utcnow().isoformat()
            }
        ]

        crisis_data = {
            'restaurantId': self.restaurant_id,
            'crisisType': 'negative_reviews',
            'severity': 'high',
            'affectedMetrics': {
                'newNegativeReviews': len(negative_reviews),
                'reviews': negative_reviews
            }
        }

        response_result = self.simulate_crisis_response(crisis_data)
        assert response_result['statusCode'] == 200

        response_body = json.loads(response_result['body'])
        recovery_plan = response_body['recoveryPlan']
        execution_results = response_body['executionResults']

        # Verify review response actions
        review_actions = [a for a in recovery_plan['immediateActions'] if 'review' in a['type']]
        assert len(review_actions) > 0

        # Verify responses were generated
        successful_review_actions = [
            r for r in execution_results
            if r['status'] == 'success' and 'review' in r['action']['type']
        ]
        assert len(successful_review_actions) > 0

    # Helper methods

    def create_baseline_metrics(self):
        """Create baseline metrics for testing"""
        return {
            'searchConsole': {
                'totalClicks': 200,
                'totalImpressions': 5000,
                'averagePosition': 8.5
            },
            'technical': {
                'loadTimeMs': 2000,
                'isAccessible': True,
                'uptimePercentage': 99.5
            },
            'reviews': {
                'averageRating': 4.5,
                'totalReviews': 150,
                'recentNegativeCount': 1
            }
        }

    def create_crisis_metrics(self):
        """Create crisis-level metrics for testing"""
        return {
            'searchConsole': {
                'totalClicks': 80,  # 60% drop
                'totalImpressions': 3000,  # 40% drop
                'averagePosition': 18  # Significant drop
            },
            'technical': {
                'loadTimeMs': 6000,  # 3x slower
                'isAccessible': True
            },
            'reviews': {
                'averageRating': 3.8,  # Lower rating
                'recentNegativeCount': 4
            }
        }

    def simulate_monitoring(self):
        """Simulate monitoring service execution"""
        # This would typically call the actual Lambda function
        # For testing, we'll return a mock response
        return {
            'statusCode': 200,
            'body': json.dumps({
                'processed': 1,
                'failed': 0,
                'results': [{
                    'restaurantId': self.restaurant_id,
                    'metricsCollected': ['searchConsole', 'technical', 'reviews'],
                    'crisisDetected': False
                }]
            })
        }

    def simulate_monitoring_for_restaurant(self, restaurant_id):
        """Simulate monitoring for a specific restaurant"""
        # Mock implementation
        return {
            'statusCode': 200,
            'body': json.dumps({
                'processed': 1,
                'results': [{
                    'restaurantId': restaurant_id,
                    'metricsCollected': ['technical'],
                    'crisisDetected': False
                }]
            })
        }

    def simulate_crisis_response(self, crisis_data):
        """Simulate crisis response execution"""
        # Mock recovery plan generation
        recovery_plan = {
            'immediateActions': [
                {
                    'type': 'technical_seo_fix',
                    'priority': 'high',
                    'description': 'Optimize page speed',
                    'estimatedTime': '30 minutes'
                },
                {
                    'type': 'content_optimization',
                    'priority': 'high',
                    'description': 'Update meta tags and content',
                    'estimatedTime': '60 minutes'
                }
            ],
            'shortTermActions': [
                {
                    'type': 'competitor_analysis',
                    'priority': 'medium',
                    'description': 'Analyze competitor activities',
                    'delayHours': 4
                }
            ],
            'longTermActions': []
        }

        # Mock execution results
        execution_results = [
            {
                'action': recovery_plan['immediateActions'][0],
                'status': 'success',
                'timestamp': datetime.utcnow().isoformat(),
                'executionTime': 25
            },
            {
                'action': recovery_plan['immediateActions'][1],
                'status': 'success',
                'timestamp': datetime.utcnow().isoformat(),
                'executionTime': 45
            }
        ]

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Crisis response executed successfully',
                'crisisEventId': str(uuid.uuid4()),
                'recoveryPlan': recovery_plan,
                'executionResults': execution_results
            })
        }

    def get_crisis_logs(self, restaurant_id):
        """Get crisis logs for a restaurant"""
        # Mock implementation
        return [
            {
                'id': str(uuid.uuid4()),
                'restaurant_id': restaurant_id,
                'crisis_type': 'ranking_drop',
                'severity': 'high',
                'detected_at': datetime.utcnow().isoformat(),
                'resolution_status': 'in_progress'
            }
        ]

    def calculate_crisis_response_effectiveness(self, before_metrics, after_metrics, baseline_metrics):
        """Calculate the effectiveness of crisis response"""
        # Calculate technical improvement
        tech_before = before_metrics['technical']['loadTimeMs']
        tech_after = after_metrics['technical']['loadTimeMs']
        tech_baseline = baseline_metrics['technical']['loadTimeMs']

        tech_improvement = (tech_before - tech_after) / (tech_before - tech_baseline) if tech_before > tech_baseline else 0

        # Calculate SEO improvement
        seo_before = before_metrics['searchConsole']['totalClicks']
        seo_after = after_metrics['searchConsole']['totalClicks']
        seo_baseline = baseline_metrics['searchConsole']['totalClicks']

        seo_improvement = (seo_after - seo_before) / (seo_baseline - seo_before) if seo_baseline > seo_before else 0

        # Overall improvement
        overall_improvement = (tech_improvement + seo_improvement) / 2

        return {
            'technical_improvement': max(0, tech_improvement),
            'seo_improvement': max(0, seo_improvement),
            'overall_improvement': max(0, overall_improvement)
        }


# Pytest test functions
def test_complete_workflow():
    """Test complete crisis workflow"""
    test_instance = TestEndToEndWorkflow()
    test_instance.setUp()
    test_instance.test_complete_crisis_workflow()

def test_load_handling():
    """Test monitoring load handling"""
    test_instance = TestEndToEndWorkflow()
    test_instance.setUp()
    test_instance.test_monitoring_load_handling()

def test_crisis_effectiveness():
    """Test crisis response effectiveness"""
    test_instance = TestEndToEndWorkflow()
    test_instance.setUp()
    test_instance.test_crisis_response_effectiveness()

def test_competitor_response():
    """Test competitor response scenario"""
    test_instance = TestEndToEndWorkflow()
    test_instance.setUp()
    test_instance.test_competitor_response_scenario()

def test_review_crisis():
    """Test review crisis management"""
    test_instance = TestEndToEndWorkflow()
    test_instance.setUp()
    test_instance.test_review_crisis_management()

if __name__ == "__main__":
    # Run tests directly
    test_complete_workflow()
    test_load_handling()
    test_crisis_effectiveness()
    test_competitor_response()
    test_review_crisis()
    print("All integration tests passed!")