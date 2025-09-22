# Variables for Terraform configuration

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "restaurantguard"
}

# Database Configuration
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Initial allocated storage for RDS (GB)"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for RDS (GB)"
  type        = number
  default     = 100
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "restaurantguard"
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
  validation {
    condition     = length(var.db_password) >= 8
    error_message = "Database password must be at least 8 characters long."
  }
}

# Lambda Configuration
variable "lambda_timeout" {
  description = "Default timeout for Lambda functions (seconds)"
  type        = number
  default     = 300
}

variable "lambda_memory_size" {
  description = "Default memory size for Lambda functions (MB)"
  type        = number
  default     = 512
}

# Monitoring Configuration
variable "monitoring_schedule" {
  description = "CloudWatch event schedule expression for monitoring"
  type        = string
  default     = "rate(15 minutes)"
}

variable "log_retention_days" {
  description = "CloudWatch logs retention period in days"
  type        = number
  default     = 30
}

# API Gateway Configuration
variable "api_gateway_stage_name" {
  description = "API Gateway stage name"
  type        = string
  default     = "prod"
}

# Bedrock Configuration
variable "bedrock_model_id" {
  description = "Bedrock foundation model ID"
  type        = string
  default     = "amazon.nova-pro-v1:0"
}

variable "bedrock_agent_idle_session_ttl" {
  description = "Bedrock agent idle session TTL in seconds"
  type        = number
  default     = 3600
}

# S3 Configuration
variable "s3_versioning_enabled" {
  description = "Enable S3 bucket versioning"
  type        = bool
  default     = true
}

# Security Configuration
variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access resources"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# Backup Configuration
variable "backup_retention_period" {
  description = "Database backup retention period in days"
  type        = number
  default     = 7
}

variable "backup_window" {
  description = "Database backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "maintenance_window" {
  description = "Database maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

# Tagging
variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "RestaurantGuard"
    ManagedBy   = "Terraform"
    Environment = "prod"
  }
}

# Performance Configuration
variable "rds_performance_insights_enabled" {
  description = "Enable RDS Performance Insights"
  type        = bool
  default     = true
}

variable "rds_performance_insights_retention_period" {
  description = "RDS Performance Insights retention period in days"
  type        = number
  default     = 7
}

# Scaling Configuration
variable "lambda_reserved_concurrency" {
  description = "Reserved concurrency for Lambda functions"
  type        = number
  default     = 100
}

variable "lambda_provisioned_concurrency" {
  description = "Provisioned concurrency for Lambda functions"
  type        = number
  default     = 10
}

# Cost Optimization
variable "schedule_lambda_functions" {
  description = "Enable scheduling to pause Lambda functions during off-hours"
  type        = bool
  default     = false
}