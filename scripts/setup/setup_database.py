#!/usr/bin/env python3
"""
Database setup script for RestaurantGuard AI Agent
Initializes PostgreSQL database with schema and sample data
"""

import os
import sys
import psycopg2
import boto3
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DatabaseSetup:
    def __init__(self):
        self.rds_endpoint = os.environ.get('RDS_ENDPOINT')
        self.rds_database = os.environ.get('RDS_DATABASE', 'restaurantguard')
        self.rds_username = os.environ.get('RDS_USERNAME', 'restaurantguard_admin')
        self.rds_password = os.environ.get('RDS_PASSWORD')

        # AWS clients
        self.secrets_manager = boto3.client('secretsmanager')

        if not self.rds_endpoint:
            raise ValueError("RDS_ENDPOINT environment variable is required")

        # Get password from Secrets Manager if not provided directly
        if not self.rds_password:
            self.rds_password = self.get_db_password()

    def get_db_password(self):
        """Get database password from AWS Secrets Manager"""
        try:
            secret_name = f"restaurantguard/database/password"
            response = self.secrets_manager.get_secret_value(SecretId=secret_name)
            secret_data = json.loads(response['SecretString'])
            return secret_data.get('password')
        except Exception as e:
            logger.error(f"Failed to get password from Secrets Manager: {e}")
            # Fallback to environment variable
            return os.environ.get('DB_PASSWORD')

    def connect_to_database(self):
        """Establish connection to PostgreSQL database"""
        try:
            connection = psycopg2.connect(
                host=self.rds_endpoint,
                database=self.rds_database,
                user=self.rds_username,
                password=self.rds_password,
                port=5432
            )
            logger.info(f"Successfully connected to database at {self.rds_endpoint}")
            return connection
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            raise

    def execute_sql_file(self, connection, file_path):
        """Execute SQL commands from a file"""
        try:
            with open(file_path, 'r') as file:
                sql_content = file.read()

            cursor = connection.cursor()

            # Split SQL content into individual statements
            statements = sql_content.split(';')

            for statement in statements:
                statement = statement.strip()
                if statement:
                    try:
                        cursor.execute(statement)
                        logger.debug(f"Executed: {statement[:100]}...")
                    except Exception as e:
                        logger.error(f"Failed to execute statement: {statement[:100]}...")
                        logger.error(f"Error: {e}")
                        raise

            connection.commit()
            cursor.close()
            logger.info(f"Successfully executed SQL file: {file_path}")

        except Exception as e:
            logger.error(f"Failed to execute SQL file {file_path}: {e}")
            connection.rollback()
            raise

    def verify_schema(self, connection):
        """Verify that the database schema was created correctly"""
        try:
            cursor = connection.cursor()

            # Check if main tables exist
            expected_tables = [
                'restaurants',
                'seo_metrics',
                'crisis_events',
                'action_outcomes',
                'competitor_tracking',
                'keyword_tracking',
                'review_tracking',
                'scheduled_actions',
                'performance_baselines',
                'audit_logs'
            ]

            cursor.execute("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_type = 'BASE TABLE'
                ORDER BY table_name
            """)

            existing_tables = [row[0] for row in cursor.fetchall()]

            # Verify all expected tables exist
            missing_tables = set(expected_tables) - set(existing_tables)
            if missing_tables:
                raise Exception(f"Missing tables: {missing_tables}")

            logger.info(f"Schema verification successful. Found {len(existing_tables)} tables.")

            # Check if views exist
            cursor.execute("""
                SELECT table_name
                FROM information_schema.views
                WHERE table_schema = 'public'
                ORDER BY table_name
            """)

            views = [row[0] for row in cursor.fetchall()]
            logger.info(f"Found {len(views)} views: {views}")

            # Verify sample data exists
            cursor.execute("SELECT COUNT(*) FROM restaurants")
            restaurant_count = cursor.fetchone()[0]
            logger.info(f"Found {restaurant_count} restaurants in database")

            cursor.close()
            return True

        except Exception as e:
            logger.error(f"Schema verification failed: {e}")
            return False

    def create_sample_data(self, connection):
        """Create additional sample data for testing"""
        try:
            cursor = connection.cursor()

            # Insert sample SEO metrics
            cursor.execute("""
                INSERT INTO seo_metrics (restaurant_id, metric_type, metric_data)
                SELECT
                    r.id,
                    'baseline_snapshot',
                    '{
                        "searchConsole": {"totalClicks": 1500, "totalImpressions": 45000, "averagePosition": 8.5},
                        "technical": {"loadTimeMs": 2300, "isAccessible": true},
                        "reviews": {"averageRating": 4.3, "totalReviews": 125}
                    }'::jsonb
                FROM restaurants r
                WHERE r.name = 'Sample Restaurant'
            """)

            # Insert sample keywords
            sample_keywords = [
                ('best restaurant nyc', 'primary', 8),
                ('italian restaurant manhattan', 'primary', 5),
                ('fine dining new york', 'secondary', 12),
                ('pizza delivery nyc', 'local', 15),
                ('romantic dinner manhattan', 'secondary', 20)
            ]

            for keyword, keyword_type, position in sample_keywords:
                cursor.execute("""
                    INSERT INTO keyword_tracking (restaurant_id, keyword, keyword_type, current_position, search_volume)
                    SELECT
                        r.id, %s, %s, %s, %s
                    FROM restaurants r
                    WHERE r.name = 'Sample Restaurant'
                """, (keyword, keyword_type, position, 1000 + position * 100))

            # Insert sample reviews
            sample_reviews = [
                ('google', 'review_001', 5, 'Amazing food and great service!', 'John D.', 0.9),
                ('google', 'review_002', 4, 'Good atmosphere, food was tasty.', 'Sarah M.', 0.7),
                ('yelp', 'yelp_001', 3, 'Food was okay, service could be better.', 'Mike R.', 0.2),
                ('yelp', 'yelp_002', 5, 'Best Italian restaurant in the area!', 'Lisa K.', 0.95)
            ]

            for platform, review_id, rating, text, reviewer, sentiment in sample_reviews:
                cursor.execute("""
                    INSERT INTO review_tracking (
                        restaurant_id, platform, review_id, rating, review_text,
                        reviewer_name, sentiment_score, review_date
                    )
                    SELECT
                        r.id, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP - INTERVAL '%s days'
                    FROM restaurants r
                    WHERE r.name = 'Sample Restaurant'
                """, (platform, review_id, rating, text, reviewer, sentiment, rating))

            connection.commit()
            cursor.close()
            logger.info("Sample data created successfully")

        except Exception as e:
            logger.error(f"Failed to create sample data: {e}")
            connection.rollback()
            raise

    def setup_monitoring_user(self, connection):
        """Create monitoring user with limited permissions"""
        try:
            cursor = connection.cursor()

            # Create monitoring user
            cursor.execute("""
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'restaurantguard_monitor') THEN
                        CREATE ROLE restaurantguard_monitor WITH LOGIN PASSWORD 'monitor_password_change_me';
                    END IF;
                END
                $$
            """)

            # Grant read-only permissions
            cursor.execute("""
                GRANT CONNECT ON DATABASE restaurantguard TO restaurantguard_monitor;
                GRANT USAGE ON SCHEMA public TO restaurantguard_monitor;
                GRANT SELECT ON ALL TABLES IN SCHEMA public TO restaurantguard_monitor;
                GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO restaurantguard_monitor;
            """)

            connection.commit()
            cursor.close()
            logger.info("Monitoring user created successfully")

        except Exception as e:
            logger.error(f"Failed to create monitoring user: {e}")
            connection.rollback()

    def setup_database(self):
        """Main setup method"""
        try:
            logger.info("Starting database setup...")

            # Connect to database
            connection = self.connect_to_database()

            # Get the directory containing this script
            script_dir = os.path.dirname(os.path.abspath(__file__))
            schema_file = os.path.join(script_dir, '..', '..', 'data', 'schemas', 'database-schema.sql')

            # Execute schema file
            logger.info("Creating database schema...")
            self.execute_sql_file(connection, schema_file)

            # Verify schema
            logger.info("Verifying database schema...")
            if not self.verify_schema(connection):
                raise Exception("Schema verification failed")

            # Create additional sample data
            logger.info("Creating sample data...")
            self.create_sample_data(connection)

            # Setup monitoring user
            logger.info("Setting up monitoring user...")
            self.setup_monitoring_user(connection)

            connection.close()
            logger.info("Database setup completed successfully!")

            return True

        except Exception as e:
            logger.error(f"Database setup failed: {e}")
            return False

def main():
    """Main function"""
    try:
        # Check if running in AWS environment
        if not os.environ.get('AWS_REGION'):
            logger.warning("AWS_REGION not set. Using default region us-east-1")
            os.environ['AWS_REGION'] = 'us-east-1'

        setup = DatabaseSetup()
        success = setup.setup_database()

        if success:
            logger.info("Database setup completed successfully!")
            sys.exit(0)
        else:
            logger.error("Database setup failed!")
            sys.exit(1)

    except Exception as e:
        logger.error(f"Setup script failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()