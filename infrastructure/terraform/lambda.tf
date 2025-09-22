# Lambda Functions

# Monitoring Service Lambda
resource "aws_lambda_function" "monitoring_service" {
  filename         = "../../dist/monitoring-service.zip"
  function_name    = "restaurantguard-monitoring"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "index.handler"
  source_code_hash = filebase64sha256("../../dist/monitoring-service.zip")
  runtime         = "nodejs18.x"
  timeout         = 300
  memory_size     = 512

  environment {
    variables = {
      RDS_ENDPOINT        = aws_db_instance.restaurantguard_db.endpoint
      RDS_DATABASE        = aws_db_instance.restaurantguard_db.db_name
      RDS_USERNAME        = var.db_username
      S3_BUCKET          = aws_s3_bucket.restaurantguard_data.bucket
      BEDROCK_AGENT_ID   = aws_bedrock_agent.restaurantguard_agent.agent_id
      SECRETS_ARN        = aws_secretsmanager_secret.api_keys.arn
      ENVIRONMENT        = var.environment
    }
  }

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_access,
    aws_cloudwatch_log_group.monitoring_service,
  ]

  tags = {
    Name = "RestaurantGuard Monitoring Service"
  }
}

# Crisis Response Lambda
resource "aws_lambda_function" "crisis_response" {
  filename         = "../../dist/crisis-response.zip"
  function_name    = "restaurantguard-crisis-response"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = filebase64sha256("../../dist/crisis-response.zip")
  runtime         = "python3.9"
  timeout         = 900
  memory_size     = 1024

  environment {
    variables = {
      RDS_ENDPOINT        = aws_db_instance.restaurantguard_db.endpoint
      RDS_DATABASE        = aws_db_instance.restaurantguard_db.db_name
      RDS_USERNAME        = var.db_username
      S3_BUCKET          = aws_s3_bucket.restaurantguard_data.bucket
      BEDROCK_AGENT_ID   = aws_bedrock_agent.restaurantguard_agent.agent_id
      SECRETS_ARN        = aws_secretsmanager_secret.api_keys.arn
      ENVIRONMENT        = var.environment
    }
  }

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_access,
    aws_cloudwatch_log_group.crisis_response,
  ]

  tags = {
    Name = "RestaurantGuard Crisis Response"
  }
}

# Technical SEO Actions Lambda
resource "aws_lambda_function" "technical_seo_actions" {
  filename         = "../../dist/technical-seo-actions.zip"
  function_name    = "restaurantguard-technical-seo"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = filebase64sha256("../../dist/technical-seo-actions.zip")
  runtime         = "python3.9"
  timeout         = 600
  memory_size     = 1024

  environment {
    variables = {
      RDS_ENDPOINT        = aws_db_instance.restaurantguard_db.endpoint
      RDS_DATABASE        = aws_db_instance.restaurantguard_db.db_name
      RDS_USERNAME        = var.db_username
      S3_BUCKET          = aws_s3_bucket.restaurantguard_data.bucket
      SECRETS_ARN        = aws_secretsmanager_secret.api_keys.arn
      ENVIRONMENT        = var.environment
    }
  }

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_access,
    aws_cloudwatch_log_group.technical_seo_actions,
  ]

  tags = {
    Name = "RestaurantGuard Technical SEO Actions"
  }
}

# Content Optimization Lambda
resource "aws_lambda_function" "content_optimization" {
  filename         = "../../dist/content-optimization.zip"
  function_name    = "restaurantguard-content-optimization"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "index.handler"
  source_code_hash = filebase64sha256("../../dist/content-optimization.zip")
  runtime         = "nodejs18.x"
  timeout         = 600
  memory_size     = 1024

  environment {
    variables = {
      RDS_ENDPOINT        = aws_db_instance.restaurantguard_db.endpoint
      RDS_DATABASE        = aws_db_instance.restaurantguard_db.db_name
      RDS_USERNAME        = var.db_username
      S3_BUCKET          = aws_s3_bucket.restaurantguard_data.bucket
      BEDROCK_AGENT_ID   = aws_bedrock_agent.restaurantguard_agent.agent_id
      SECRETS_ARN        = aws_secretsmanager_secret.api_keys.arn
      ENVIRONMENT        = var.environment
    }
  }

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_access,
    aws_cloudwatch_log_group.content_optimization,
  ]

  tags = {
    Name = "RestaurantGuard Content Optimization"
  }
}

# Review Management Lambda
resource "aws_lambda_function" "review_management" {
  filename         = "../../dist/review-management.zip"
  function_name    = "restaurantguard-review-management"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = filebase64sha256("../../dist/review-management.zip")
  runtime         = "python3.9"
  timeout         = 600
  memory_size     = 512

  environment {
    variables = {
      RDS_ENDPOINT        = aws_db_instance.restaurantguard_db.endpoint
      RDS_DATABASE        = aws_db_instance.restaurantguard_db.db_name
      RDS_USERNAME        = var.db_username
      S3_BUCKET          = aws_s3_bucket.restaurantguard_data.bucket
      BEDROCK_AGENT_ID   = aws_bedrock_agent.restaurantguard_agent.agent_id
      SECRETS_ARN        = aws_secretsmanager_secret.api_keys.arn
      ENVIRONMENT        = var.environment
    }
  }

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_access,
    aws_cloudwatch_log_group.review_management,
  ]

  tags = {
    Name = "RestaurantGuard Review Management"
  }
}

# GMB Management Lambda
resource "aws_lambda_function" "gmb_management" {
  filename         = "../../dist/gmb-management.zip"
  function_name    = "restaurantguard-gmb-management"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "lambda_function.lambda_handler"
  source_code_hash = filebase64sha256("../../dist/gmb-management.zip")
  runtime         = "python3.9"
  timeout         = 300
  memory_size     = 512

  environment {
    variables = {
      RDS_ENDPOINT        = aws_db_instance.restaurantguard_db.endpoint
      RDS_DATABASE        = aws_db_instance.restaurantguard_db.db_name
      RDS_USERNAME        = var.db_username
      S3_BUCKET          = aws_s3_bucket.restaurantguard_data.bucket
      SECRETS_ARN        = aws_secretsmanager_secret.api_keys.arn
      ENVIRONMENT        = var.environment
    }
  }

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_vpc_access,
    aws_cloudwatch_log_group.gmb_management,
  ]

  tags = {
    Name = "RestaurantGuard GMB Management"
  }
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "monitoring_service" {
  name              = "/aws/lambda/restaurantguard-monitoring"
  retention_in_days = 30

  tags = {
    Name = "RestaurantGuard Monitoring Service Logs"
  }
}

resource "aws_cloudwatch_log_group" "crisis_response" {
  name              = "/aws/lambda/restaurantguard-crisis-response"
  retention_in_days = 30

  tags = {
    Name = "RestaurantGuard Crisis Response Logs"
  }
}

resource "aws_cloudwatch_log_group" "technical_seo_actions" {
  name              = "/aws/lambda/restaurantguard-technical-seo"
  retention_in_days = 30

  tags = {
    Name = "RestaurantGuard Technical SEO Actions Logs"
  }
}

resource "aws_cloudwatch_log_group" "content_optimization" {
  name              = "/aws/lambda/restaurantguard-content-optimization"
  retention_in_days = 30

  tags = {
    Name = "RestaurantGuard Content Optimization Logs"
  }
}

resource "aws_cloudwatch_log_group" "review_management" {
  name              = "/aws/lambda/restaurantguard-review-management"
  retention_in_days = 30

  tags = {
    Name = "RestaurantGuard Review Management Logs"
  }
}

resource "aws_cloudwatch_log_group" "gmb_management" {
  name              = "/aws/lambda/restaurantguard-gmb-management"
  retention_in_days = 30

  tags = {
    Name = "RestaurantGuard GMB Management Logs"
  }
}

# EventBridge Rules for Scheduling
resource "aws_cloudwatch_event_rule" "monitoring_schedule" {
  name                = "restaurantguard-monitoring-schedule"
  description         = "Trigger monitoring every 15 minutes"
  schedule_expression = "rate(15 minutes)"

  tags = {
    Name = "RestaurantGuard Monitoring Schedule"
  }
}

resource "aws_cloudwatch_event_target" "monitoring_target" {
  rule      = aws_cloudwatch_event_rule.monitoring_schedule.name
  target_id = "MonitoringLambdaTarget"
  arn       = aws_lambda_function.monitoring_service.arn
}

resource "aws_lambda_permission" "allow_eventbridge_monitoring" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.monitoring_service.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.monitoring_schedule.arn
}