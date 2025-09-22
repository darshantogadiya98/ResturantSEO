# RestaurantGuard AI Agent - Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Infrastructure Setup](#infrastructure-setup)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [API Setup](#api-setup)
7. [Monitoring Setup](#monitoring-setup)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **AWS CLI** (v2.0+)
- **Terraform** (v1.0+)
- **Node.js** (v18+)
- **Python** (v3.9+)
- **Git**

### AWS Requirements

- AWS Account with administrative access
- AWS CLI configured with appropriate credentials
- Access to AWS Bedrock (Nova Pro model)
- Sufficient service limits for:
  - Lambda functions (6 functions)
  - RDS instances (1 instance)
  - S3 buckets (1 bucket)
  - API Gateway endpoints

### Cost Estimation

Monthly costs (approximate):
- **Development**: $50-100
- **Production**: $200-500
- **High-volume**: $500-1000+

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd RestaurantSEO

# Set environment variables
export AWS_REGION=us-east-1
export ENVIRONMENT=prod
```

### 2. Configure AWS Credentials

```bash
aws configure
# Enter your AWS credentials
```

### 3. Deploy Infrastructure

```bash
# Make deployment script executable
chmod +x scripts/deployment/deploy.sh

# Run deployment
./scripts/deployment/deploy.sh
```

### 4. Configure API Keys

After deployment, add your API keys to AWS Secrets Manager:

```bash
aws secretsmanager update-secret \
  --secret-id restaurantguard/api-keys \
  --secret-string '{
    "google_search_console": "YOUR_GSC_KEY",
    "google_my_business": "YOUR_GMB_KEY",
    "yelp_fusion": "YOUR_YELP_KEY"
  }'
```

## Infrastructure Setup

### Terraform Configuration

The infrastructure is defined in `infrastructure/terraform/`:

- **main.tf**: Core AWS resources
- **lambda.tf**: Lambda functions
- **bedrock.tf**: Bedrock agent configuration
- **api-gateway.tf**: API Gateway setup
- **variables.tf**: Configuration variables
- **outputs.tf**: Resource outputs

### Manual Terraform Deployment

If you prefer manual control:

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var-file="prod.tfvars"

# Apply changes
terraform apply -var-file="prod.tfvars"
```

### Key Resources Created

- **VPC**: Private network with public/private subnets
- **RDS**: PostgreSQL database for data storage
- **Lambda**: 6 functions for different operations
- **S3**: Data storage bucket
- **API Gateway**: REST API endpoints
- **Bedrock Agent**: AI-powered crisis response
- **CloudWatch**: Logging and monitoring
- **Secrets Manager**: Secure API key storage

## Configuration

### Environment Variables

Key environment variables to configure:

```bash
# AWS Configuration
export AWS_REGION=us-east-1
export ENVIRONMENT=prod

# Database Configuration
export RDS_ENDPOINT=<your-rds-endpoint>
export RDS_DATABASE=restaurantguard
export RDS_USERNAME=restaurantguard_admin
export DB_PASSWORD=<secure-password>

# Application Configuration
export BEDROCK_AGENT_ID=<your-agent-id>
export S3_BUCKET=<your-s3-bucket>
```

### Terraform Variables

Edit `infrastructure/terraform/prod.tfvars`:

```hcl
# Basic Configuration
aws_region = "us-east-1"
environment = "prod"

# Database Configuration
db_instance_class = "db.t3.micro"  # For production: db.t3.small or larger
db_allocated_storage = 50
db_username = "restaurantguard_admin"

# Lambda Configuration
lambda_timeout = 300
lambda_memory_size = 512

# Monitoring Configuration
monitoring_schedule = "rate(15 minutes)"
log_retention_days = 30
```

## Database Setup

### Automatic Setup

The deployment script automatically sets up the database. To manually run:

```bash
python3 scripts/setup/setup_database.py
```

### Manual Setup

1. **Connect to RDS instance**:

```bash
psql -h <rds-endpoint> -U restaurantguard_admin -d restaurantguard
```

2. **Run schema script**:

```sql
\i data/schemas/database-schema.sql
```

### Database Schema

Key tables:
- `restaurants`: Restaurant profiles and configuration
- `seo_metrics`: SEO performance data
- `crisis_events`: Crisis detection and response logs
- `action_outcomes`: Action effectiveness tracking
- `keyword_tracking`: Keyword position monitoring
- `review_tracking`: Review management data

## API Setup

### API Gateway Endpoints

The API provides these endpoints:

- `POST /monitor`: Trigger monitoring for a restaurant
- `POST /crisis`: Handle crisis response
- `POST /restaurants`: Create new restaurant profile
- `GET /restaurants/{id}`: Get restaurant information

### API Authentication

The API uses AWS IAM authentication. To call the API:

1. **Generate AWS signature** for requests
2. **Use appropriate IAM role** with API access permissions

### Example API Call

```bash
# Using AWS CLI
aws apigateway-v2 invoke \
  --api-id <your-api-id> \
  --route-key "POST /monitor" \
  --body '{"restaurantId": "restaurant-123"}' \
  --output-file response.json
```

## Monitoring Setup

### CloudWatch Setup

The monitoring system creates:

- **Custom Metrics**: Crisis detection, resolution time, action success
- **Alarms**: High error rates, slow performance, database issues
- **Dashboard**: System overview and performance metrics
- **Log Groups**: Centralized logging for all components

### Manual Monitoring Setup

```bash
python3 scripts/monitoring/cloudwatch_setup.py
```

### Key Metrics to Monitor

1. **Crisis Detection Rate**: Number of crises detected per hour
2. **Resolution Time**: Average time to resolve crises
3. **Action Success Rate**: Percentage of successful automated actions
4. **System Performance**: Lambda duration, database connections

### Setting Up Alerts

1. **SNS Topic**: Subscribe to get alerts
2. **Email Notifications**: Add your email to SNS topic
3. **Slack Integration**: Configure webhook for Slack alerts

```bash
# Subscribe to alerts
aws sns subscribe \
  --topic-arn <sns-topic-arn> \
  --protocol email \
  --notification-endpoint your-email@example.com
```

## Testing

### Unit Tests

```bash
# JavaScript tests
npm test

# Python tests
pytest tests/unit/
```

### Integration Tests

```bash
# Run integration tests
pytest tests/integration/ -v
```

### Load Tests

```bash
# Run load tests
pytest tests/load/ -m load
```

### Manual Testing

1. **Create test restaurant**:

```bash
curl -X POST <api-gateway-url>/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Restaurant",
    "address": {...},
    "contactInfo": {...}
  }'
```

2. **Trigger monitoring**:

```bash
curl -X POST <api-gateway-url>/monitor \
  -H "Content-Type: application/json" \
  -d '{"restaurantId": "restaurant-id"}'
```

## Troubleshooting

### Common Issues

#### 1. Terraform Deployment Fails

**Error**: "InvalidParameterValue: The parameter groupName cannot be used with the parameter subnet"

**Solution**:
```bash
# Clean up and retry
terraform destroy
terraform init -upgrade
terraform apply
```

#### 2. Lambda Function Timeouts

**Error**: Function execution time exceeded

**Solution**:
- Increase timeout in `lambda.tf`
- Optimize function code
- Check network connectivity

#### 3. Database Connection Issues

**Error**: "could not connect to server"

**Solution**:
- Verify security groups
- Check RDS endpoint
- Validate credentials in Secrets Manager

#### 4. Bedrock Access Denied

**Error**: "AccessDeniedException: You don't have access to the model"

**Solution**:
- Request model access in Bedrock console
- Verify IAM permissions
- Check region availability

### Debugging Steps

1. **Check CloudWatch Logs**:

```bash
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/restaurantguard"
```

2. **Verify Resource Creation**:

```bash
# Check Lambda functions
aws lambda list-functions --query 'Functions[?starts_with(FunctionName, `restaurantguard`)]'

# Check RDS instances
aws rds describe-db-instances
```

3. **Test Database Connectivity**:

```bash
python3 scripts/setup/test_database_connection.py
```

### Performance Optimization

#### Database Optimization

1. **Connection Pooling**: Use RDS Proxy for production
2. **Indexing**: Monitor slow queries and add indexes
3. **Caching**: Implement Redis for frequently accessed data

#### Lambda Optimization

1. **Memory Allocation**: Monitor and adjust based on usage
2. **Cold Starts**: Use provisioned concurrency for critical functions
3. **Package Size**: Minimize deployment package size

#### Cost Optimization

1. **Reserved Instances**: Use for production RDS
2. **Lambda Provisioned Concurrency**: Only for critical functions
3. **S3 Storage Classes**: Use Intelligent Tiering
4. **CloudWatch Logs**: Set appropriate retention periods

### Rollback Procedures

#### Infrastructure Rollback

```bash
cd infrastructure/terraform

# Revert to previous version
git checkout <previous-commit>

# Apply previous configuration
terraform plan
terraform apply
```

#### Application Rollback

```bash
# Revert Lambda function code
aws lambda update-function-code \
  --function-name restaurantguard-monitoring \
  --zip-file fileb://previous-version.zip
```

### Support and Maintenance

#### Regular Maintenance Tasks

1. **Weekly**: Review CloudWatch dashboards
2. **Monthly**: Analyze cost reports
3. **Quarterly**: Security review and updates
4. **Annually**: Architecture review

#### Backup Procedures

1. **Database Backups**: Automated daily backups (7-day retention)
2. **Configuration Backups**: Terraform state files
3. **Code Backups**: Git repository with tags

#### Monitoring and Alerting

Set up monitoring for:
- System availability (99.9% target)
- Response times (<3 seconds)
- Error rates (<1%)
- Cost thresholds

For additional support, refer to:
- [API Documentation](../api/)
- [Architecture Guide](../architecture/)
- [GitHub Issues](https://github.com/your-org/restaurantguard/issues)