# Production Environment Configuration

aws_region   = "us-east-1"
environment  = "prod"
project_name = "restaurantguard"

# Database Configuration
db_instance_class       = "db.t3.micro"
db_allocated_storage    = 50
db_max_allocated_storage = 200
db_username            = "restaurantguard_admin"

# Lambda Configuration
lambda_timeout     = 300
lambda_memory_size = 512

# Monitoring Configuration
monitoring_schedule = "rate(15 minutes)"
log_retention_days  = 30

# API Gateway Configuration
api_gateway_stage_name = "prod"

# Bedrock Configuration
bedrock_model_id                = "amazon.nova-pro-v1:0"
bedrock_agent_idle_session_ttl = 3600

# S3 Configuration
s3_versioning_enabled = true

# Security Configuration
allowed_cidr_blocks = ["0.0.0.0/0"]

# Backup Configuration
backup_retention_period = 7
backup_window          = "03:00-04:00"
maintenance_window     = "sun:04:00-sun:05:00"

# Performance Configuration
rds_performance_insights_enabled           = true
rds_performance_insights_retention_period = 7

# Scaling Configuration
lambda_reserved_concurrency    = 100
lambda_provisioned_concurrency = 10

# Cost Optimization
schedule_lambda_functions = false

# Common Tags
common_tags = {
  Project     = "RestaurantGuard"
  Environment = "prod"
  ManagedBy   = "Terraform"
  Owner       = "DevOps"
  CostCenter  = "Engineering"
}