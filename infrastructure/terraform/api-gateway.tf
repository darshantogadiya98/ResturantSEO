# API Gateway Configuration

resource "aws_api_gateway_rest_api" "restaurantguard_api" {
  name        = "restaurantguard-api"
  description = "RestaurantGuard AI Agent API"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name = "RestaurantGuard API"
  }
}

# API Gateway Resources
resource "aws_api_gateway_resource" "monitor" {
  rest_api_id = aws_api_gateway_rest_api.restaurantguard_api.id
  parent_id   = aws_api_gateway_rest_api.restaurantguard_api.root_resource_id
  path_part   = "monitor"
}

resource "aws_api_gateway_resource" "crisis" {
  rest_api_id = aws_api_gateway_rest_api.restaurantguard_api.id
  parent_id   = aws_api_gateway_rest_api.restaurantguard_api.root_resource_id
  path_part   = "crisis"
}

resource "aws_api_gateway_resource" "restaurants" {
  rest_api_id = aws_api_gateway_rest_api.restaurantguard_api.id
  parent_id   = aws_api_gateway_rest_api.restaurantguard_api.root_resource_id
  path_part   = "restaurants"
}

resource "aws_api_gateway_resource" "restaurant_id" {
  rest_api_id = aws_api_gateway_rest_api.restaurantguard_api.id
  parent_id   = aws_api_gateway_resource.restaurants.id
  path_part   = "{restaurantId}"
}

# API Gateway Methods
resource "aws_api_gateway_method" "monitor_post" {
  rest_api_id   = aws_api_gateway_rest_api.restaurantguard_api.id
  resource_id   = aws_api_gateway_resource.monitor.id
  http_method   = "POST"
  authorization = "AWS_IAM"

  request_validator_id = aws_api_gateway_request_validator.validator.id
  request_models = {
    "application/json" = aws_api_gateway_model.monitor_request.name
  }
}

resource "aws_api_gateway_method" "crisis_post" {
  rest_api_id   = aws_api_gateway_rest_api.restaurantguard_api.id
  resource_id   = aws_api_gateway_resource.crisis.id
  http_method   = "POST"
  authorization = "AWS_IAM"

  request_validator_id = aws_api_gateway_request_validator.validator.id
  request_models = {
    "application/json" = aws_api_gateway_model.crisis_request.name
  }
}

resource "aws_api_gateway_method" "restaurants_post" {
  rest_api_id   = aws_api_gateway_rest_api.restaurantguard_api.id
  resource_id   = aws_api_gateway_resource.restaurants.id
  http_method   = "POST"
  authorization = "AWS_IAM"

  request_validator_id = aws_api_gateway_request_validator.validator.id
  request_models = {
    "application/json" = aws_api_gateway_model.restaurant_request.name
  }
}

resource "aws_api_gateway_method" "restaurant_get" {
  rest_api_id   = aws_api_gateway_rest_api.restaurantguard_api.id
  resource_id   = aws_api_gateway_resource.restaurant_id.id
  http_method   = "GET"
  authorization = "AWS_IAM"

  request_parameters = {
    "method.request.path.restaurantId" = true
  }
}

# API Gateway Integrations
resource "aws_api_gateway_integration" "monitor_lambda" {
  rest_api_id = aws_api_gateway_rest_api.restaurantguard_api.id
  resource_id = aws_api_gateway_resource.monitor.id
  http_method = aws_api_gateway_method.monitor_post.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.monitoring_service.invoke_arn
}

resource "aws_api_gateway_integration" "crisis_lambda" {
  rest_api_id = aws_api_gateway_rest_api.restaurantguard_api.id
  resource_id = aws_api_gateway_resource.crisis.id
  http_method = aws_api_gateway_method.crisis_post.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.crisis_response.invoke_arn
}

# Request Models
resource "aws_api_gateway_model" "monitor_request" {
  rest_api_id  = aws_api_gateway_rest_api.restaurantguard_api.id
  name         = "MonitorRequest"
  content_type = "application/json"

  schema = jsonencode({
    "$schema" = "http://json-schema.org/draft-04/schema#"
    title     = "Monitor Request Schema"
    type      = "object"
    properties = {
      restaurantId = {
        type        = "string"
        description = "Restaurant ID to monitor"
      }
      forceRefresh = {
        type        = "boolean"
        description = "Force refresh of all metrics"
        default     = false
      }
      metricsTypes = {
        type        = "array"
        description = "Specific metrics to collect"
        items = {
          type = "string"
          enum = ["rankings", "traffic", "reviews", "technical"]
        }
      }
    }
    required = ["restaurantId"]
  })
}

resource "aws_api_gateway_model" "crisis_request" {
  rest_api_id  = aws_api_gateway_rest_api.restaurantguard_api.id
  name         = "CrisisRequest"
  content_type = "application/json"

  schema = jsonencode({
    "$schema" = "http://json-schema.org/draft-04/schema#"
    title     = "Crisis Request Schema"
    type      = "object"
    properties = {
      restaurantId = {
        type        = "string"
        description = "Restaurant ID experiencing crisis"
      }
      crisisType = {
        type        = "string"
        description = "Type of crisis detected"
        enum        = ["ranking_drop", "traffic_drop", "negative_reviews", "technical_issues"]
      }
      severity = {
        type        = "string"
        description = "Crisis severity level"
        enum        = ["low", "medium", "high", "critical"]
      }
      affectedMetrics = {
        type        = "object"
        description = "Metrics showing the crisis"
      }
      currentMetrics = {
        type        = "object"
        description = "Current performance metrics"
      }
      baseline = {
        type        = "object"
        description = "Historical baseline metrics"
      }
    }
    required = ["restaurantId", "crisisType", "severity"]
  })
}

resource "aws_api_gateway_model" "restaurant_request" {
  rest_api_id  = aws_api_gateway_rest_api.restaurantguard_api.id
  name         = "RestaurantRequest"
  content_type = "application/json"

  schema = jsonencode({
    "$schema" = "http://json-schema.org/draft-04/schema#"
    title     = "Restaurant Request Schema"
    type      = "object"
    properties = {
      name = {
        type        = "string"
        description = "Restaurant name"
      }
      address = {
        type        = "object"
        description = "Restaurant address"
        properties = {
          street   = { type = "string" }
          city     = { type = "string" }
          state    = { type = "string" }
          zipCode  = { type = "string" }
          country  = { type = "string" }
        }
        required = ["street", "city", "state", "zipCode"]
      }
      contactInfo = {
        type        = "object"
        description = "Contact information"
        properties = {
          phone   = { type = "string" }
          email   = { type = "string", format = "email" }
          website = { type = "string", format = "uri" }
        }
        required = ["phone", "email", "website"]
      }
      cuisine = {
        type        = "array"
        description = "Cuisine types"
        items       = { type = "string" }
      }
      targetKeywords = {
        type        = "array"
        description = "Target SEO keywords"
        items       = { type = "string" }
      }
    }
    required = ["name", "address", "contactInfo", "cuisine"]
  })
}

# Request Validator
resource "aws_api_gateway_request_validator" "validator" {
  name                        = "request-validator"
  rest_api_id                = aws_api_gateway_rest_api.restaurantguard_api.id
  validate_request_body       = true
  validate_request_parameters = true
}

# Lambda Permissions for API Gateway
resource "aws_lambda_permission" "api_gateway_monitor" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.monitoring_service.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.restaurantguard_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gateway_crisis" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.crisis_response.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.restaurantguard_api.execution_arn}/*/*"
}

# API Gateway Deployment
resource "aws_api_gateway_deployment" "restaurantguard_deployment" {
  depends_on = [
    aws_api_gateway_method.monitor_post,
    aws_api_gateway_method.crisis_post,
    aws_api_gateway_method.restaurants_post,
    aws_api_gateway_method.restaurant_get,
    aws_api_gateway_integration.monitor_lambda,
    aws_api_gateway_integration.crisis_lambda,
  ]

  rest_api_id = aws_api_gateway_rest_api.restaurantguard_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.monitor.id,
      aws_api_gateway_resource.crisis.id,
      aws_api_gateway_resource.restaurants.id,
      aws_api_gateway_method.monitor_post.id,
      aws_api_gateway_method.crisis_post.id,
      aws_api_gateway_integration.monitor_lambda.id,
      aws_api_gateway_integration.crisis_lambda.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "restaurantguard_stage" {
  deployment_id = aws_api_gateway_deployment.restaurantguard_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.restaurantguard_api.id
  stage_name    = var.api_gateway_stage_name

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      caller         = "$context.identity.caller"
      user           = "$context.identity.user"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      resourcePath   = "$context.resourcePath"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
    })
  }

  xray_tracing_enabled = true

  tags = {
    Name = "RestaurantGuard API Stage"
  }
}

# CloudWatch Log Group for API Gateway
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/restaurantguard"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "RestaurantGuard API Gateway Logs"
  }
}

# API Gateway Method Settings
resource "aws_api_gateway_method_settings" "all" {
  rest_api_id = aws_api_gateway_rest_api.restaurantguard_api.id
  stage_name  = aws_api_gateway_stage.restaurantguard_stage.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled = true
    logging_level   = "INFO"
  }
}

# API Gateway Account
resource "aws_api_gateway_account" "main" {
  cloudwatch_role_arn = aws_iam_role.api_gateway_cloudwatch.arn
}

# IAM Role for API Gateway CloudWatch
resource "aws_iam_role" "api_gateway_cloudwatch" {
  name = "restaurantguard-api-gateway-cloudwatch-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_gateway_cloudwatch" {
  role       = aws_iam_role.api_gateway_cloudwatch.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
}