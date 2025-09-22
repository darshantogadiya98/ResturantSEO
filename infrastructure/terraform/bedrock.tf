# Bedrock Agent Configuration

resource "aws_bedrock_agent" "restaurantguard_agent" {
  agent_name                  = "RestaurantGuardAgent"
  agent_resource_role_arn    = aws_iam_role.bedrock_agent_role.arn
  foundation_model           = "amazon.nova-pro-v1:0"
  instruction                = file("${path.module}/agent-instructions.txt")
  idle_session_ttl_in_seconds = 3600
  description                = "AI agent specialized in restaurant SEO crisis detection and response"

  tags = {
    Name = "RestaurantGuard AI Agent"
  }
}

# Action Groups for Bedrock Agent
resource "aws_bedrock_agent_action_group" "technical_seo_actions" {
  action_group_name = "TechnicalSEOActions"
  agent_id         = aws_bedrock_agent.restaurantguard_agent.agent_id
  agent_version    = "DRAFT"
  description      = "Execute technical SEO fixes and optimizations"

  action_group_executor {
    lambda = aws_lambda_function.technical_seo_actions.arn
  }

  api_schema {
    payload = jsonencode({
      openapi = "3.0.1"
      info = {
        title   = "Technical SEO Actions API"
        version = "1.0.0"
      }
      paths = {
        "/optimize-page-speed" = {
          post = {
            summary     = "Optimize page speed and performance"
            description = "Analyze and fix page speed issues including image optimization, CSS/JS minification, and caching"
            parameters = []
            requestBody = {
              required = true
              content = {
                "application/json" = {
                  schema = {
                    type = "object"
                    properties = {
                      restaurantId = {
                        type        = "string"
                        description = "Restaurant ID"
                      }
                      pages = {
                        type        = "array"
                        description = "List of pages to optimize"
                        items = {
                          type = "string"
                        }
                      }
                    }
                    required = ["restaurantId", "pages"]
                  }
                }
              }
            }
            responses = {
              "200" = {
                description = "Optimization completed"
                content = {
                  "application/json" = {
                    schema = {
                      type = "object"
                      properties = {
                        success = {
                          type = "boolean"
                        }
                        optimizations = {
                          type = "array"
                          items = {
                            type = "object"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        "/fix-mobile-issues" = {
          post = {
            summary     = "Fix mobile responsiveness issues"
            description = "Detect and fix mobile usability problems"
            parameters = []
            requestBody = {
              required = true
              content = {
                "application/json" = {
                  schema = {
                    type = "object"
                    properties = {
                      restaurantId = {
                        type        = "string"
                        description = "Restaurant ID"
                      }
                      pages = {
                        type        = "array"
                        description = "List of pages with mobile issues"
                        items = {
                          type = "string"
                        }
                      }
                    }
                    required = ["restaurantId", "pages"]
                  }
                }
              }
            }
            responses = {
              "200" = {
                description = "Mobile issues fixed"
              }
            }
          }
        }
        "/update-schema-markup" = {
          post = {
            summary     = "Update structured data markup"
            description = "Generate and implement restaurant schema markup"
            parameters = []
            requestBody = {
              required = true
              content = {
                "application/json" = {
                  schema = {
                    type = "object"
                    properties = {
                      restaurantId = {
                        type        = "string"
                        description = "Restaurant ID"
                      }
                    }
                    required = ["restaurantId"]
                  }
                }
              }
            }
            responses = {
              "200" = {
                description = "Schema markup updated"
              }
            }
          }
        }
      }
    })
  }
}

resource "aws_bedrock_agent_action_group" "content_optimization" {
  action_group_name = "ContentOptimization"
  agent_id         = aws_bedrock_agent.restaurantguard_agent.agent_id
  agent_version    = "DRAFT"
  description      = "Generate and optimize restaurant content"

  action_group_executor {
    lambda = aws_lambda_function.content_optimization.arn
  }

  api_schema {
    payload = jsonencode({
      openapi = "3.0.1"
      info = {
        title   = "Content Optimization API"
        version = "1.0.0"
      }
      paths = {
        "/optimize-homepage" = {
          post = {
            summary     = "Optimize homepage content"
            description = "Generate SEO-optimized homepage content"
            parameters = []
            requestBody = {
              required = true
              content = {
                "application/json" = {
                  schema = {
                    type = "object"
                    properties = {
                      restaurantId = {
                        type        = "string"
                        description = "Restaurant ID"
                      }
                      goals = {
                        type        = "array"
                        description = "Optimization goals"
                        items = {
                          type = "string"
                        }
                      }
                    }
                    required = ["restaurantId", "goals"]
                  }
                }
              }
            }
            responses = {
              "200" = {
                description = "Homepage optimized"
              }
            }
          }
        }
        "/create-blog-content" = {
          post = {
            summary     = "Create blog content"
            description = "Generate SEO-optimized blog posts"
            parameters = []
            requestBody = {
              required = true
              content = {
                "application/json" = {
                  schema = {
                    type = "object"
                    properties = {
                      restaurantId = {
                        type        = "string"
                        description = "Restaurant ID"
                      }
                      topics = {
                        type        = "array"
                        description = "Blog post topics"
                        items = {
                          type = "string"
                        }
                      }
                    }
                    required = ["restaurantId", "topics"]
                  }
                }
              }
            }
            responses = {
              "200" = {
                description = "Blog content created"
              }
            }
          }
        }
      }
    })
  }
}

resource "aws_bedrock_agent_action_group" "review_management" {
  action_group_name = "ReviewManagement"
  agent_id         = aws_bedrock_agent.restaurantguard_agent.agent_id
  agent_version    = "DRAFT"
  description      = "Manage and respond to restaurant reviews"

  action_group_executor {
    lambda = aws_lambda_function.review_management.arn
  }

  api_schema {
    payload = jsonencode({
      openapi = "3.0.1"
      info = {
        title   = "Review Management API"
        version = "1.0.0"
      }
      paths = {
        "/respond-to-reviews" = {
          post = {
            summary     = "Respond to customer reviews"
            description = "Generate and post professional responses to reviews"
            parameters = []
            requestBody = {
              required = true
              content = {
                "application/json" = {
                  schema = {
                    type = "object"
                    properties = {
                      restaurantId = {
                        type        = "string"
                        description = "Restaurant ID"
                      }
                      platforms = {
                        type        = "array"
                        description = "Review platforms to process"
                        items = {
                          type = "string"
                        }
                      }
                    }
                    required = ["restaurantId"]
                  }
                }
              }
            }
            responses = {
              "200" = {
                description = "Review responses generated"
              }
            }
          }
        }
        "/analyze-sentiment" = {
          post = {
            summary     = "Analyze review sentiment"
            description = "Analyze sentiment trends in recent reviews"
            parameters = []
            requestBody = {
              required = true
              content = {
                "application/json" = {
                  schema = {
                    type = "object"
                    properties = {
                      restaurantId = {
                        type        = "string"
                        description = "Restaurant ID"
                      }
                      days = {
                        type        = "integer"
                        description = "Number of days to analyze"
                        default     = 30
                      }
                    }
                    required = ["restaurantId"]
                  }
                }
              }
            }
            responses = {
              "200" = {
                description = "Sentiment analysis completed"
              }
            }
          }
        }
      }
    })
  }
}

# Lambda permissions for Bedrock Agent
resource "aws_lambda_permission" "allow_bedrock_technical_seo" {
  statement_id  = "AllowExecutionFromBedrock"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.technical_seo_actions.function_name
  principal     = "bedrock.amazonaws.com"
  source_arn    = aws_bedrock_agent.restaurantguard_agent.agent_arn
}

resource "aws_lambda_permission" "allow_bedrock_content_optimization" {
  statement_id  = "AllowExecutionFromBedrock"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.content_optimization.function_name
  principal     = "bedrock.amazonaws.com"
  source_arn    = aws_bedrock_agent.restaurantguard_agent.agent_arn
}

resource "aws_lambda_permission" "allow_bedrock_review_management" {
  statement_id  = "AllowExecutionFromBedrock"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.review_management.function_name
  principal     = "bedrock.amazonaws.com"
  source_arn    = aws_bedrock_agent.restaurantguard_agent.agent_arn
}

# Knowledge Base for Restaurant SEO Best Practices
resource "aws_bedrock_knowledge_base" "restaurant_seo_playbook" {
  name     = "restaurant-seo-playbook"
  role_arn = aws_iam_role.bedrock_knowledge_base_role.arn

  description = "Restaurant SEO best practices and crisis recovery strategies"

  knowledge_base_configuration {
    type = "VECTOR"
    vector_knowledge_base_configuration {
      embedding_model_arn = "arn:aws:bedrock:${data.aws_region.current.name}::foundation-model/amazon.titan-embed-text-v1"
    }
  }

  storage_configuration {
    type = "OPENSEARCH_SERVERLESS"
    opensearch_serverless_configuration {
      collection_arn    = aws_opensearchserverless_collection.knowledge_base.arn
      vector_index_name = "restaurant-seo-index"
      field_mapping {
        vector_field   = "vector"
        text_field     = "text"
        metadata_field = "metadata"
      }
    }
  }

  tags = {
    Name = "Restaurant SEO Knowledge Base"
  }
}

# OpenSearch Serverless Collection for Knowledge Base
resource "aws_opensearchserverless_collection" "knowledge_base" {
  name = "restaurant-seo-kb"
  type = "VECTORSEARCH"

  tags = {
    Name = "Restaurant SEO Knowledge Base Collection"
  }
}

# IAM Role for Knowledge Base
resource "aws_iam_role" "bedrock_knowledge_base_role" {
  name = "restaurantguard-bedrock-kb-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "bedrock.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "bedrock_knowledge_base_policy" {
  name = "restaurantguard-bedrock-kb-policy"
  role = aws_iam_role.bedrock_knowledge_base_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel"
        ]
        Resource = "arn:aws:bedrock:${data.aws_region.current.name}::foundation-model/amazon.titan-embed-text-v1"
      },
      {
        Effect = "Allow"
        Action = [
          "aoss:APIAccessAll"
        ]
        Resource = aws_opensearchserverless_collection.knowledge_base.arn
      }
    ]
  })
}