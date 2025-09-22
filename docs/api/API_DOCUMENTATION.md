# RestaurantGuard AI Agent - API Documentation

## Overview

The RestaurantGuard API provides endpoints for managing restaurant SEO monitoring, crisis response, and performance analytics. The API is built on AWS API Gateway with Lambda backend services.

## Base URL

```
https://<api-gateway-id>.execute-api.<region>.amazonaws.com/prod
```

## Authentication

The API uses AWS IAM authentication with API keys. All requests must include proper AWS signatures.

### Authentication Headers

```
Authorization: AWS4-HMAC-SHA256 Credential=<credentials>
X-Amz-Date: <timestamp>
Content-Type: application/json
```

## Rate Limits

- **Standard Tier**: 1000 requests per minute
- **Premium Tier**: 5000 requests per minute
- **Enterprise Tier**: 10000 requests per minute

## Endpoints

### 1. Restaurant Management

#### Create Restaurant Profile

**POST** `/restaurants`

Creates a new restaurant profile for monitoring.

**Request Body:**
```json
{
  "name": "Luigi's Pizza Palace",
  "address": {
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "contactInfo": {
    "phone": "+1-555-0123",
    "email": "info@luigispizza.com",
    "website": "https://luigispizza.com"
  },
  "cuisine": ["Italian", "Pizza"],
  "targetKeywords": [
    "best pizza nyc",
    "italian restaurant manhattan",
    "pizza delivery near me"
  ],
  "digitalPresence": {
    "googleMyBusinessId": "gmb-12345",
    "yelpBusinessId": "yelp-67890",
    "facebookPageId": "fb-54321"
  },
  "monitoringConfig": {
    "frequency": "15_minutes",
    "alertThresholds": {
      "rankingDrop": 30,
      "trafficDrop": 20,
      "negativeReviews": 3
    }
  }
}
```

**Response:**
```json
{
  "statusCode": 201,
  "body": {
    "restaurantId": "rest_abc123def456",
    "message": "Restaurant profile created successfully",
    "monitoringStatus": "active",
    "nextMonitoring": "2024-01-15T10:30:00Z"
  }
}
```

**Response Codes:**
- `201`: Restaurant created successfully
- `400`: Invalid request data
- `409`: Restaurant already exists
- `500`: Internal server error

#### Get Restaurant Profile

**GET** `/restaurants/{restaurantId}`

Retrieves restaurant profile and current status.

**Path Parameters:**
- `restaurantId`: Unique restaurant identifier

**Response:**
```json
{
  "statusCode": 200,
  "body": {
    "restaurant": {
      "id": "rest_abc123def456",
      "name": "Luigi's Pizza Palace",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastMonitored": "2024-01-15T10:15:00Z",
      "currentMetrics": {
        "seoScore": 85,
        "averageRanking": 6.2,
        "monthlyTraffic": 12500,
        "reviewRating": 4.5
      },
      "alerts": {
        "active": 0,
        "total": 15,
        "lastAlert": "2024-01-10T14:22:00Z"
      }
    }
  }
}
```

#### Update Restaurant Profile

**PUT** `/restaurants/{restaurantId}`

Updates restaurant profile information.

**Request Body:** (Same as create, partial updates allowed)

**Response:**
```json
{
  "statusCode": 200,
  "body": {
    "message": "Restaurant profile updated successfully",
    "updatedFields": ["targetKeywords", "monitoringConfig"]
  }
}
```

#### Delete Restaurant Profile

**DELETE** `/restaurants/{restaurantId}`

Removes restaurant from monitoring (soft delete).

**Response:**
```json
{
  "statusCode": 200,
  "body": {
    "message": "Restaurant monitoring disabled",
    "dataRetentionDays": 90
  }
}
```

### 2. Monitoring Operations

#### Trigger Manual Monitoring

**POST** `/monitor`

Triggers immediate monitoring for one or more restaurants.

**Request Body:**
```json
{
  "restaurantId": "rest_abc123def456",
  "forceRefresh": true,
  "metricsTypes": [
    "rankings",
    "traffic",
    "reviews",
    "technical"
  ]
}
```

**Response:**
```json
{
  "statusCode": 200,
  "body": {
    "message": "Monitoring initiated",
    "taskId": "mon_xyz789abc123",
    "estimatedCompletion": "2024-01-15T10:20:00Z",
    "metricsCollected": [
      "rankings",
      "traffic",
      "reviews",
      "technical"
    ]
  }
}
```

#### Get Monitoring Status

**GET** `/monitor/{taskId}`

Retrieves status of monitoring task.

**Response:**
```json
{
  "statusCode": 200,
  "body": {
    "taskId": "mon_xyz789abc123",
    "status": "completed",
    "progress": 100,
    "startedAt": "2024-01-15T10:15:00Z",
    "completedAt": "2024-01-15T10:18:00Z",
    "results": {
      "metricsCollected": 4,
      "crisisDetected": false,
      "dataQuality": "high",
      "nextScheduledRun": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 3. Crisis Management

#### Get Crisis Events

**GET** `/restaurants/{restaurantId}/crises`

Retrieves crisis events for a restaurant.

**Query Parameters:**
- `limit`: Number of results (default: 50, max: 200)
- `offset`: Pagination offset
- `status`: Filter by status (`detected`, `in_progress`, `resolved`)
- `severity`: Filter by severity (`low`, `medium`, `high`, `critical`)
- `from`: Start date (ISO 8601)
- `to`: End date (ISO 8601)

**Response:**
```json
{
  "statusCode": 200,
  "body": {
    "crises": [
      {
        "id": "crisis_def456ghi789",
        "restaurantId": "rest_abc123def456",
        "type": "ranking_drop",
        "severity": "high",
        "status": "resolved",
        "detectedAt": "2024-01-10T14:22:00Z",
        "resolvedAt": "2024-01-10T16:45:00Z",
        "resolutionTimeMinutes": 143,
        "affectedKeywords": [
          "best pizza nyc",
          "pizza delivery manhattan"
        ],
        "impactScore": 0.75,
        "actionsExecuted": 5,
        "recoveryPercentage": 85
      }
    ],
    "pagination": {
      "total": 15,
      "limit": 50,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

#### Trigger Manual Crisis Response

**POST** `/crisis`

Manually triggers crisis response for detected issues.

**Request Body:**
```json
{
  "restaurantId": "rest_abc123def456",
  "crisisType": "ranking_drop",
  "severity": "high",
  "affectedMetrics": {
    "keywords": ["best pizza nyc"],
    "positionDrop": 15,
    "trafficDrop": 25
  },
  "currentMetrics": {
    "rankings": {
      "best pizza nyc": {
        "current": 18,
        "previous": 3
      }
    }
  },
  "overrideAutoResponse": false
}
```

**Response:**
```json
{
  "statusCode": 200,
  "body": {
    "crisisId": "crisis_def456ghi789",
    "message": "Crisis response initiated",
    "recoveryPlan": {
      "immediateActions": 3,
      "shortTermActions": 2,
      "estimatedRecoveryTime": "2-5 days"
    },
    "actionsExecuted": [
      {
        "type": "technical_seo_fix",
        "status": "completed",
        "executionTime": 45
      }
    ]
  }
}
```

### 4. Analytics and Reporting

#### Get Performance Metrics

**GET** `/restaurants/{restaurantId}/metrics`

Retrieves performance metrics and analytics.

**Query Parameters:**
- `period`: Time period (`24h`, `7d`, `30d`, `90d`)
- `metrics`: Comma-separated list of metric types
- `granularity`: Data granularity (`hourly`, `daily`, `weekly`)

**Response:**
```json
{
  "statusCode": 200,
  "body": {
    "restaurantId": "rest_abc123def456",
    "period": "30d",
    "summary": {
      "averageRanking": 6.2,
      "rankingImprovement": "+15%",
      "trafficGrowth": "+22%",
      "reviewRating": 4.5,
      "crisisCount": 2,
      "resolutionTime": "2.5 hours"
    },
    "metrics": {
      "rankings": [
        {
          "date": "2024-01-15",
          "keyword": "best pizza nyc",
          "position": 5,
          "change": -2
        }
      ],
      "traffic": [
        {
          "date": "2024-01-15",
          "organicSessions": 450,
          "clicks": 320,
          "impressions": 8500
        }
      ],
      "reviews": [
        {
          "date": "2024-01-15",
          "platform": "google",
          "newReviews": 3,
          "averageRating": 4.7
        }
      ]
    }
  }
}
```

#### Generate Report

**POST** `/restaurants/{restaurantId}/reports`

Generates comprehensive performance report.

**Request Body:**
```json
{
  "reportType": "monthly",
  "period": {
    "from": "2024-01-01T00:00:00Z",
    "to": "2024-01-31T23:59:59Z"
  },
  "includeCompetitors": true,
  "format": "pdf",
  "emailTo": "owner@restaurant.com"
}
```

**Response:**
```json
{
  "statusCode": 202,
  "body": {
    "reportId": "rep_jkl012mno345",
    "message": "Report generation started",
    "estimatedCompletion": "2024-01-15T10:25:00Z",
    "deliveryMethod": "email"
  }
}
```

### 5. Keyword Management

#### Get Keyword Rankings

**GET** `/restaurants/{restaurantId}/keywords`

Retrieves current keyword rankings and historical data.

**Response:**
```json
{
  "statusCode": 200,
  "body": {
    "keywords": [
      {
        "keyword": "best pizza nyc",
        "type": "primary",
        "currentPosition": 5,
        "previousPosition": 7,
        "bestPosition": 2,
        "searchVolume": 8100,
        "difficulty": 75,
        "trend": "improving",
        "lastUpdated": "2024-01-15T10:15:00Z"
      }
    ],
    "summary": {
      "totalKeywords": 25,
      "topThreePositions": 8,
      "pageOnePositions": 18,
      "averagePosition": 6.2,
      "positionImprovement": "+2.3"
    }
  }
}
```

#### Add Keywords

**POST** `/restaurants/{restaurantId}/keywords`

Adds new keywords to track.

**Request Body:**
```json
{
  "keywords": [
    {
      "keyword": "authentic neapolitan pizza",
      "type": "secondary",
      "priority": "medium"
    }
  ]
}
```

### 6. Review Management

#### Get Reviews

**GET** `/restaurants/{restaurantId}/reviews`

Retrieves reviews from all platforms.

**Query Parameters:**
- `platform`: Filter by platform (`google`, `yelp`, `tripadvisor`)
- `rating`: Filter by rating (1-5)
- `responded`: Filter by response status
- `sentiment`: Filter by sentiment (`positive`, `neutral`, `negative`)

**Response:**
```json
{
  "statusCode": 200,
  "body": {
    "reviews": [
      {
        "id": "rev_pqr678stu901",
        "platform": "google",
        "rating": 5,
        "text": "Amazing pizza! Best in the neighborhood.",
        "reviewerName": "John D.",
        "reviewDate": "2024-01-14T18:30:00Z",
        "sentiment": "positive",
        "topics": ["food_quality", "service"],
        "responded": true,
        "responseDate": "2024-01-14T20:15:00Z"
      }
    ],
    "summary": {
      "totalReviews": 247,
      "averageRating": 4.5,
      "responseRate": 95,
      "sentimentBreakdown": {
        "positive": 185,
        "neutral": 45,
        "negative": 17
      }
    }
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "statusCode": 400,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request body contains invalid data",
    "details": {
      "field": "targetKeywords",
      "issue": "Array must contain at least one keyword"
    },
    "requestId": "req_abc123def456"
  }
}
```

### Common Error Codes

- `400`: Bad Request - Invalid request data
- `401`: Unauthorized - Invalid authentication
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `409`: Conflict - Resource already exists
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server error
- `503`: Service Unavailable - Service temporarily unavailable

## SDK Examples

### JavaScript/Node.js

```javascript
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-key'
});

const apigateway = new AWS.APIGateway();

// Create restaurant
async function createRestaurant(restaurantData) {
  const params = {
    restApiId: 'your-api-id',
    resourceId: 'restaurants',
    httpMethod: 'POST',
    body: JSON.stringify(restaurantData)
  };

  try {
    const result = await apigateway.testInvokeMethod(params).promise();
    return JSON.parse(result.body);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
}
```

### Python

```python
import boto3
import json

# Create API client
client = boto3.client('apigatewayv2', region_name='us-east-1')

def create_restaurant(restaurant_data):
    """Create a new restaurant profile"""
    try:
        response = client.invoke(
            ApiId='your-api-id',
            RouteKey='POST /restaurants',
            Body=json.dumps(restaurant_data)
        )
        return json.loads(response['Body'])
    except Exception as e:
        print(f"Error creating restaurant: {e}")
        raise

# Example usage
restaurant_data = {
    "name": "Luigi's Pizza Palace",
    "address": {
        "street": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001"
    },
    "contactInfo": {
        "phone": "+1-555-0123",
        "email": "info@luigispizza.com",
        "website": "https://luigispizza.com"
    },
    "cuisine": ["Italian", "Pizza"],
    "targetKeywords": ["best pizza nyc", "italian restaurant manhattan"]
}

result = create_restaurant(restaurant_data)
print(f"Restaurant created with ID: {result['restaurantId']}")
```

### cURL Examples

```bash
# Create restaurant
curl -X POST https://api-gateway-url/prod/restaurants \
  -H "Authorization: AWS4-HMAC-SHA256 ..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Luigi\'s Pizza Palace",
    "address": {
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "contactInfo": {
      "phone": "+1-555-0123",
      "email": "info@luigispizza.com",
      "website": "https://luigispizza.com"
    },
    "cuisine": ["Italian", "Pizza"],
    "targetKeywords": ["best pizza nyc"]
  }'

# Trigger monitoring
curl -X POST https://api-gateway-url/prod/monitor \
  -H "Authorization: AWS4-HMAC-SHA256 ..." \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "rest_abc123def456",
    "forceRefresh": true
  }'

# Get restaurant metrics
curl -X GET "https://api-gateway-url/prod/restaurants/rest_abc123def456/metrics?period=30d" \
  -H "Authorization: AWS4-HMAC-SHA256 ..."
```

## Webhooks

### Crisis Alert Webhook

Configure webhooks to receive real-time crisis alerts:

**POST** `/restaurants/{restaurantId}/webhooks`

```json
{
  "url": "https://your-app.com/webhooks/crisis",
  "events": ["crisis.detected", "crisis.resolved"],
  "secret": "your-webhook-secret"
}
```

**Webhook Payload:**
```json
{
  "event": "crisis.detected",
  "timestamp": "2024-01-15T10:15:00Z",
  "restaurantId": "rest_abc123def456",
  "crisis": {
    "id": "crisis_def456ghi789",
    "type": "ranking_drop",
    "severity": "high",
    "affectedKeywords": ["best pizza nyc"],
    "estimatedImpact": "high"
  }
}
```

## Rate Limiting

The API implements rate limiting based on:
- Requests per minute
- Concurrent requests
- Data volume per request

Rate limit headers in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## Support

For API support and questions:
- **Documentation**: [API Docs](https://docs.restaurantguard.ai/api)
- **Support Email**: api-support@restaurantguard.ai
- **Status Page**: [status.restaurantguard.ai](https://status.restaurantguard.ai)
- **GitHub Issues**: [GitHub Repository](https://github.com/your-org/restaurantguard)