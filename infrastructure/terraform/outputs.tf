# Terraform Outputs

# Infrastructure Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

# Database Outputs
output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.restaurantguard_db.endpoint
  sensitive   = true
}

output "rds_port" {
  description = "RDS instance port"
  value       = aws_db_instance.restaurantguard_db.port
}

output "database_name" {
  description = "Database name"
  value       = aws_db_instance.restaurantguard_db.db_name
}

# S3 Outputs
output "s3_bucket_name" {
  description = "Name of the S3 bucket for data storage"
  value       = aws_s3_bucket.restaurantguard_data.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.restaurantguard_data.arn
}

# Lambda Function Outputs
output "monitoring_lambda_arn" {
  description = "ARN of the monitoring Lambda function"
  value       = aws_lambda_function.monitoring_service.arn
}

output "crisis_response_lambda_arn" {
  description = "ARN of the crisis response Lambda function"
  value       = aws_lambda_function.crisis_response.arn
}

output "technical_seo_lambda_arn" {
  description = "ARN of the technical SEO Lambda function"
  value       = aws_lambda_function.technical_seo_actions.arn
}

output "content_optimization_lambda_arn" {
  description = "ARN of the content optimization Lambda function"
  value       = aws_lambda_function.content_optimization.arn
}

output "review_management_lambda_arn" {
  description = "ARN of the review management Lambda function"
  value       = aws_lambda_function.review_management.arn
}

output "gmb_management_lambda_arn" {
  description = "ARN of the GMB management Lambda function"
  value       = aws_lambda_function.gmb_management.arn
}

# Bedrock Outputs
output "bedrock_agent_id" {
  description = "ID of the Bedrock agent"
  value       = aws_bedrock_agent.restaurantguard_agent.agent_id
}

output "bedrock_agent_arn" {
  description = "ARN of the Bedrock agent"
  value       = aws_bedrock_agent.restaurantguard_agent.agent_arn
}

output "knowledge_base_id" {
  description = "ID of the Bedrock knowledge base"
  value       = aws_bedrock_knowledge_base.restaurant_seo_playbook.id
}

# API Gateway Outputs
output "api_gateway_url" {
  description = "URL of the API Gateway"
  value       = aws_api_gateway_rest_api.restaurantguard_api.execution_arn
}

output "api_gateway_id" {
  description = "ID of the API Gateway"
  value       = aws_api_gateway_rest_api.restaurantguard_api.id
}

# Secrets Manager Outputs
output "secrets_manager_arn" {
  description = "ARN of the Secrets Manager secret for API keys"
  value       = aws_secretsmanager_secret.api_keys.arn
  sensitive   = true
}

# IAM Role Outputs
output "lambda_execution_role_arn" {
  description = "ARN of the Lambda execution role"
  value       = aws_iam_role.lambda_execution_role.arn
}

output "bedrock_agent_role_arn" {
  description = "ARN of the Bedrock agent role"
  value       = aws_iam_role.bedrock_agent_role.arn
}

# Security Group Outputs
output "lambda_security_group_id" {
  description = "ID of the Lambda security group"
  value       = aws_security_group.lambda.id
}

output "rds_security_group_id" {
  description = "ID of the RDS security group"
  value       = aws_security_group.rds.id
}

# CloudWatch Outputs
output "monitoring_schedule_rule_arn" {
  description = "ARN of the CloudWatch event rule for monitoring"
  value       = aws_cloudwatch_event_rule.monitoring_schedule.arn
}

# Environment Information
output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "account_id" {
  description = "AWS account ID"
  value       = data.aws_caller_identity.current.account_id
}

# Connection Strings and Configuration
output "database_connection_info" {
  description = "Database connection information"
  value = {
    host     = aws_db_instance.restaurantguard_db.endpoint
    port     = aws_db_instance.restaurantguard_db.port
    database = aws_db_instance.restaurantguard_db.db_name
    username = var.db_username
  }
  sensitive = true
}

output "lambda_environment_variables" {
  description = "Common environment variables for Lambda functions"
  value = {
    RDS_ENDPOINT     = aws_db_instance.restaurantguard_db.endpoint
    RDS_DATABASE     = aws_db_instance.restaurantguard_db.db_name
    RDS_USERNAME     = var.db_username
    S3_BUCKET        = aws_s3_bucket.restaurantguard_data.bucket
    BEDROCK_AGENT_ID = aws_bedrock_agent.restaurantguard_agent.agent_id
    SECRETS_ARN      = aws_secretsmanager_secret.api_keys.arn
    ENVIRONMENT      = var.environment
  }
  sensitive = true
}

# Deployment Information
output "deployment_summary" {
  description = "Summary of deployed resources"
  value = {
    vpc_created              = aws_vpc.main.id
    subnets_created         = length(aws_subnet.public) + length(aws_subnet.private)
    lambda_functions_created = 6
    bedrock_agent_created   = aws_bedrock_agent.restaurantguard_agent.agent_name
    database_created        = aws_db_instance.restaurantguard_db.identifier
    s3_bucket_created       = aws_s3_bucket.restaurantguard_data.bucket
    secrets_created         = aws_secretsmanager_secret.api_keys.name
  }
}