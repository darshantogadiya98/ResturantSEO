# RestaurantGuard AI Agent

## Software Requirements Specification (SRS)

**Document Version:** 1.0  
**Date:** October 2025  
**Project:** RestaurantGuard - Autonomous Restaurant Revenue Protection System

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [Technical Architecture](#5-technical-architecture)
6. [Data Management](#6-data-management)
7. [External Integrations](#7-external-integrations)
8. [User Interface Requirements](#8-user-interface-requirements)
9. [Security and Compliance](#9-security-and-compliance)
10. [Development Timeline](#10-development-timeline)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment and Operations](#12-deployment-and-operations)
13. [Risk Management](#13-risk-management)
14. [Future Enhancements](#14-future-enhancements)
15. [Appendices](#15-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a comprehensive description of the RestaurantGuard AI Agent system. It details functional and non-functional requirements, system architecture, and implementation guidelines for all stakeholders including developers, project managers, QA teams, and business stakeholders.

### 1.2 Scope

RestaurantGuard is an autonomous AI agent designed to protect restaurant revenue through:

- Real-time SEO crisis detection and automated recovery
- Predictive market adaptation capabilities
- Competitive intelligence and benchmarking
- Multi-location management for restaurant chains

The system prevents $2,000-$15,000 monthly revenue losses by detecting and resolving SEO issues within 24 hours versus the industry standard of 3-6 months.

### 1.3 Document Conventions

- **Critical**: Must-have features for MVP launch
- **High**: Important features for competitive advantage
- **Medium**: Valuable features for post-MVP releases
- **Low**: Future enhancement considerations

### 1.4 Intended Audience

- Software Engineers and Architects
- Project Managers and Product Owners
- Quality Assurance Teams
- DevOps and Infrastructure Engineers
- Business Stakeholders and Investors
- Restaurant Industry Partners

### 1.5 Project Background

#### Market Context

- Local SEO software market: $253B (2024) → $1.96T projected (2033)
- CAGR: 29.19%
- Restaurant vertical: 93% of dining decisions begin with online search
- Current detection timeframe: 3-6 months (industry standard)
- RestaurantGuard detection: <24 hours (1000× improvement)

#### Problem Statement

Restaurants face three critical challenges:

1. **Revenue Crisis**: Invisible SEO drops cause $2,000-$15,000 monthly losses with 2-4 week detection delays and 3-6 month recovery periods
2. **Market Adaptation Blindness**: Lack of real-time intelligence for adapting to consumer demands and competitive moves
3. **Performance Blind Spots**: No visibility into competitive positioning and industry benchmarks

#### Solution Validation

- 87% of diners research online before visiting
- 78% of foot traffic driven by local search
- Single star rating change: 5-9% revenue impact
- 73% of customers return if issues addressed promptly

---

## 2. System Overview

### 2.1 Product Perspective

RestaurantGuard operates as a standalone SaaS platform built on AWS infrastructure, integrating with:

- Google My Business API
- Google Search Console API
- Review platforms (Yelp, TripAdvisor)
- Restaurant management systems (future integration)
- Social media monitoring tools

### 2.2 Product Features

#### Core Features (MVP - Month 1)

1. **Crisis Detection Agent**

   - Real-time monitoring (15-minute intervals)
   - Ranking drop detection (>3 positions)
   - Traffic loss detection (>20%)
   - Review score monitoring (>0.5 star drops)
   - GMB suspension alerts

2. **Automated Response System**

   - GMB profile optimization
   - Technical SEO fixes
   - Content updates
   - Recovery action execution

3. **Alert Management**

   - Real-time email/SMS notifications
   - Severity classification (Critical/Warning/Info)
   - Alert history and tracking
   - Resolution workflow

4. **Basic Dashboard**
   - Key metrics visualization
   - Performance trends
   - Alert center
   - Daily reports

#### Extended Features (Post-MVP)

5. **Predictive Market Adaptation Module**

   - Consumer trend forecasting
   - Adaptive content engine
   - Opportunity detection
   - Competitive intelligence

6. **Market Intelligence Dashboard**

   - Weekly competitive benchmarking
   - Industry performance scoring
   - Revenue opportunity analysis
   - Seasonal trend analysis

7. **Multi-Location Management**
   - Centralized dashboard for chains
   - Location-specific optimization
   - Franchise performance comparison

### 2.3 User Classes and Characteristics

#### Primary Users

**Independent Restaurant Owners (1-5 locations)**

- Technical proficiency: Low to Medium
- Primary need: Automated SEO protection
- Budget sensitivity: High
- Decision speed: Fast (1-2 weeks)

**Regional Restaurant Groups (6-25 locations)**

- Technical proficiency: Medium
- Primary need: Scalable monitoring across locations
- Budget sensitivity: Medium
- Decision speed: Medium (2-4 weeks)

**Enterprise Restaurant Chains (25+ locations)**

- Technical proficiency: High (dedicated marketing teams)
- Primary need: Enterprise-grade automation and reporting
- Budget sensitivity: Low
- Decision speed: Slow (1-3 months)

### 2.4 Operating Environment

#### Technical Environment

- **Cloud Platform**: AWS (Lambda, RDS, S3, API Gateway, CloudWatch)
- **AI/ML Platform**: Amazon Bedrock Nova Pro
- **Database**: PostgreSQL 15 (primary), Redis (cache)
- **Frontend**: Modern web browsers (Chrome, Firefox, Safari, Edge)
- **Mobile**: Responsive web design (iOS/Android browsers)

#### Operating Constraints

- API rate limits (GMB: 300 req/min, GSC: 1200 req/min)
- Real-time processing requirements (<2 second response)
- High availability requirements (99.9% uptime)
- Data privacy compliance (GDPR, CCPA)

### 2.5 Design and Implementation Constraints

#### Technical Constraints

- Must use AWS Bedrock Nova Pro for AI capabilities
- Limited to Google API rate limits
- Real-time monitoring requires efficient polling mechanisms
- Storage costs must scale linearly with customer growth

#### Regulatory Constraints

- GDPR compliance for EU customers
- CCPA compliance for California customers
- Data retention policies (7 years for financial records)
- PCI DSS compliance for payment processing

#### Business Constraints

- MVP must launch within 30 days
- Initial budget: $112,500-$137,500 (Year 1)
- Operating cost target: <$100/restaurant/month at scale
- Must achieve 70% automation rate for MVP

### 2.6 Assumptions and Dependencies

#### Assumptions

- Google APIs remain stable and accessible
- AWS Bedrock Nova Pro maintains current pricing
- Restaurant owners have basic technical literacy
- Internet connectivity is reliable for monitoring

#### Dependencies

- AWS service availability
- Third-party API stability (Google, Yelp, TripAdvisor)
- Bedrock Nova Pro model performance
- Email/SMS delivery service reliability (SendGrid, Twilio)

---

## 3. Functional Requirements

### 3.1 Core SEO Monitoring Functions

#### FR-001: Real-Time Ranking Monitoring

- **Priority**: Critical
- **Description**: System shall monitor Google My Business rankings every 15 minutes
- **Inputs**: Restaurant location data, target keywords, geographic parameters
- **Processing**:
  - Query GMB API for current rankings
  - Compare against baseline and previous intervals
  - Calculate ranking change percentage
- **Outputs**: Current ranking position, change delta, trend indicators
- **Success Criteria**:
  - 99.5% successful monitoring checks
  - <30 second processing time per restaurant
  - <1% false positive rate
- **MVP Status**: ✓ Included

#### FR-002: Traffic Loss Detection

- **Priority**: Critical
- **Description**: System shall detect traffic losses exceeding 20% within detection interval
- **Inputs**: Search Console data, GMB insights, website analytics
- **Processing**:
  - Aggregate traffic data from multiple sources
  - Calculate percentage change vs. baseline
  - Apply seasonal adjustment factors
  - Trigger alert if threshold exceeded
- **Outputs**: Traffic metrics, percentage change, alert notification
- **Success Criteria**:
  - Detect 95% of significant traffic drops
  - <15 minute alert latency
  - Distinguish seasonal patterns from crises
- **MVP Status**: ✓ Included

#### FR-003: Review Score Monitoring

- **Priority**: Critical
- **Description**: System shall track review scores and detect drops >0.5 stars
- **Inputs**: GMB reviews, Yelp reviews, TripAdvisor reviews
- **Processing**:
  - Aggregate review data across platforms
  - Calculate weighted average scores
  - Detect rapid sentiment shifts
  - Analyze review velocity changes
- **Outputs**: Review metrics, sentiment analysis, velocity indicators
- **Success Criteria**:
  - Process 100% of new reviews within 15 minutes
  - 92-94% sentiment analysis accuracy
  - Identify review bombing patterns
- **MVP Status**: ✓ Included

#### FR-004: GMB Suspension Detection

- **Priority**: Critical
- **Description**: System shall immediately detect GMB listing suspensions
- **Inputs**: GMB API status checks
- **Processing**:
  - Query GMB listing status every 15 minutes
  - Detect suspension, verification issues, or policy violations
  - Classify suspension type and severity
- **Outputs**: Suspension alerts, violation details, recovery recommendations
- **Success Criteria**:
  - <15 minute detection time
  - 100% suspension detection rate
  - Zero false positives
- **MVP Status**: ✓ Included

### 3.2 Crisis Analysis Functions

#### FR-005: Root Cause Analysis

- **Priority**: Critical
- **Description**: System shall analyze detected crises using Bedrock Nova Pro
- **Inputs**: Crisis metrics, historical patterns, competitive data
- **Processing**:
  - Invoke Nova Pro LLM with crisis context
  - Correlate with known algorithm updates
  - Analyze competitor movements
  - Calculate impact severity (1-10 scale)
- **Outputs**: Root cause identification, severity score, confidence percentage
- **Success Criteria**:
  - 85%+ accurate root cause identification
  - <60 second analysis time
  - Actionable recommendations provided
- **MVP Status**: ✓ Included

#### FR-006: Impact Severity Scoring

- **Priority**: Critical
- **Description**: System shall calculate crisis severity on 1-10 scale
- **Inputs**: Multiple crisis indicators (ranking, traffic, reviews, GMB status)
- **Processing**:
  - Weight each factor by revenue impact potential
  - Calculate composite severity score
  - Classify as Critical (8-10), Warning (5-7), Info (1-4)
- **Outputs**: Severity classification, weighted score breakdown
- **Success Criteria**:
  - 90%+ accuracy in severity classification
  - Consistent scoring across similar scenarios
- **MVP Status**: ✓ Included

### 3.3 Automated Response Functions

#### FR-007: GMB Profile Optimization

- **Priority**: Critical
- **Description**: System shall automatically update GMB profiles to resolve issues
- **Inputs**: GMB profile data, optimization recommendations, business information
- **Processing**:
  - Identify profile completion gaps
  - Generate optimized content using Nova Pro
  - Update business hours, categories, attributes
  - Add/optimize photos and posts
- **Outputs**: Updated GMB profile, change log, success confirmation
- **Success Criteria**:
  - 70%+ successful automated updates
  - Comply with GMB API limits (10 edits/min)
  - No policy violations from automated changes
- **MVP Status**: ✓ Included

#### FR-008: Technical SEO Fixes

- **Priority**: High
- **Description**: System shall execute technical SEO corrections
- **Inputs**: Website crawl data, Search Console errors, technical issues
- **Processing**:
  - Identify fixable technical issues
  - Generate fix recommendations
  - Execute automated fixes where possible
  - Queue manual interventions when needed
- **Outputs**: Fixed issues list, pending actions, success rate
- **Success Criteria**:
  - 60%+ issues resolved automatically
  - <24 hour fix implementation time
- **MVP Status**: Post-MVP

#### FR-009: Content Update System

- **Priority**: High
- **Description**: System shall update website content to improve relevance
- **Inputs**: Keyword research, competitor analysis, content performance data
- **Processing**:
  - Generate optimized content using Nova Pro
  - Update meta descriptions, titles, headers
  - Refresh outdated menu/service information
- **Outputs**: Updated content, SEO score improvements
- **Success Criteria**:
  - Content meets quality standards (readability, keyword density)
  - No duplicate content issues
- **MVP Status**: Post-MVP

### 3.4 Alert and Notification Functions

#### FR-010: Real-Time Alert System

- **Priority**: Critical
- **Description**: System shall send immediate alerts for detected crises
- **Inputs**: Crisis detection events, user notification preferences
- **Processing**:
  - Format alert message with crisis details
  - Route to configured channels (email, SMS, dashboard)
  - Track delivery status
  - Implement escalation for critical alerts
- **Outputs**: Delivered notifications, delivery confirmations
- **Success Criteria**:
  - <2 minute alert delivery time
  - 99.9% delivery success rate
  - Support multiple notification channels
- **MVP Status**: ✓ Included

#### FR-011: Alert Management Interface

- **Priority**: Critical
- **Description**: Users shall manage alerts through dashboard interface
- **Inputs**: User actions (view, acknowledge, resolve, dismiss)
- **Processing**:
  - Display alert history with filtering/sorting
  - Track alert lifecycle (active → acknowledged → resolved)
  - Enable user comments and notes
- **Outputs**: Alert status updates, audit trail
- **Success Criteria**:
  - Intuitive interface requiring <5 minutes training
  - Complete alert history retention
- **MVP Status**: ✓ Included

### 3.5 Reporting Functions

#### FR-012: Daily Performance Reports

- **Priority**: High
- **Description**: System shall generate automated daily performance summaries
- **Inputs**: 24-hour aggregated metrics, trend analysis
- **Processing**:
  - Compile key performance indicators
  - Generate visualizations (charts, graphs)
  - Highlight significant changes
  - Calculate day-over-day comparisons
- **Outputs**: PDF/email report, dashboard summary
- **Success Criteria**:
  - Reports delivered by 8 AM local time
  - Include minimum 10 key metrics
  - Visual clarity for non-technical users
- **MVP Status**: ✓ Included

#### FR-013: Weekly Competitive Benchmarking

- **Priority**: Medium
- **Description**: System shall provide weekly competitive performance comparisons
- **Inputs**: Restaurant metrics, competitor data, industry benchmarks
- **Processing**:
  - Aggregate competitive intelligence
  - Calculate relative performance scores
  - Identify opportunities and threats
- **Outputs**: Comparative report, action recommendations
- **Success Criteria**:
  - Include minimum 5 direct competitors
  - Actionable insights provided
- **MVP Status**: Post-MVP

### 3.6 User Management Functions

#### FR-014: User Authentication

- **Priority**: Critical
- **Description**: System shall authenticate users securely
- **Inputs**: User credentials (email, password)
- **Processing**:
  - Validate credentials against database
  - Generate session tokens
  - Implement multi-factor authentication (optional)
- **Outputs**: Authentication status, session token
- **Success Criteria**:
  - Support OAuth 2.0, JWT tokens
  - Password encryption (bcrypt, minimum 10 rounds)
  - Session timeout after 30 minutes inactivity
- **MVP Status**: ✓ Included

#### FR-015: Role-Based Access Control

- **Priority**: High
- **Description**: System shall enforce role-based permissions
- **Inputs**: User role assignments (Owner, Manager, Viewer)
- **Processing**:
  - Validate user permissions for each action
  - Restrict access to sensitive features
  - Log access attempts
- **Outputs**: Access granted/denied, audit logs
- **Success Criteria**:
  - Support minimum 3 role types
  - Granular permission controls
- **MVP Status**: ✓ Included

### 3.7 Predictive Functions (Post-MVP)

#### FR-016: Consumer Trend Forecasting

- **Priority**: Medium
- **Description**: System shall predict emerging consumer trends
- **Inputs**: Search patterns, review sentiment, social media data
- **Processing**:
  - Analyze time-series data for trend detection
  - Use Nova Pro for pattern recognition
  - Generate 30-60 day forecasts
- **Outputs**: Trend predictions, confidence scores, recommendations
- **Success Criteria**:
  - 70%+ forecast accuracy
  - Early trend detection (2-4 weeks advance)
- **MVP Status**: Post-MVP

#### FR-017: Menu Optimization Recommendations

- **Priority**: Low
- **Description**: System shall suggest menu changes based on market data
- **Inputs**: Menu performance, competitor menus, search trends
- **Processing**:
  - Identify underperforming items
  - Detect trending menu categories
  - Generate optimization suggestions
- **Outputs**: Menu change recommendations, expected impact
- **Success Criteria**:
  - Data-driven recommendations
  - Include revenue impact estimates
- **MVP Status**: Post-MVP

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

#### NFR-001: Response Time

- **Requirement**: API responses shall complete within 2 seconds (95th percentile)
- **MVP Target**: <3 seconds
- **Measurement**: CloudWatch metrics, application performance monitoring
- **Acceptance Criteria**:
  - Dashboard page load: <2 seconds
  - API endpoint response: <2 seconds
  - Real-time updates: <500ms latency

#### NFR-002: Crisis Detection Speed

- **Requirement**: Crisis detection shall occur within 15 minutes of event
- **MVP Target**: <30 minutes
- **Measurement**: Time from event occurrence to alert generation
- **Acceptance Criteria**:
  - Ranking drops detected: <15 minutes
  - Traffic losses detected: <15 minutes
  - Review issues detected: <15 minutes

#### NFR-003: Throughput

- **Requirement**: System shall support 1000+ concurrent restaurant monitoring
- **MVP Target**: 50 restaurants
- **Measurement**: Load testing results, production monitoring
- **Acceptance Criteria**:
  - Process 1000 monitoring checks per 15-minute interval
  - Handle 500 concurrent dashboard users
  - Support 10,000 API requests per minute

### 4.2 Scalability Requirements

#### NFR-004: Horizontal Scalability

- **Requirement**: System shall scale horizontally without architecture changes
- **Implementation**:
  - Stateless Lambda functions
  - Database read replicas
  - Redis clustering for cache
  - CDN for static assets
- **Acceptance Criteria**:
  - Auto-scale from 50 to 500 restaurants with zero code changes
  - Linear cost scaling with customer growth
  - No single points of failure

#### NFR-005: Data Volume Growth

- **Requirement**: System shall handle 10TB+ data storage capacity
- **Current**: 100 GB (MVP)
- **Growth Plan**:
  - Year 1: 1 TB
  - Year 2: 5 TB
  - Year 3: 10 TB
- **Acceptance Criteria**:
  - Automated storage expansion
  - Query performance maintained as data grows
  - Cost-efficient archival strategy

### 4.3 Reliability Requirements

#### NFR-006: System Uptime

- **Requirement**: 99.9% uptime (43.8 minutes downtime per month)
- **MVP Target**: 99.5% uptime (3.6 hours downtime per month)
- **Implementation**:
  - Multi-availability zone deployment
  - Automated failover
  - Health check monitoring
  - Disaster recovery procedures
- **Acceptance Criteria**:
  - Automated recovery from failures
  - Zero data loss during failures
  - <5 minute failover time

#### NFR-007: Data Durability

- **Requirement**: 99.999999999% (11 nines) data durability
- **Implementation**:
  - RDS automated backups (daily)
  - Point-in-time recovery enabled
  - S3 cross-region replication
  - Transaction log archival
- **Acceptance Criteria**:
  - No data loss in last 12 months
  - Successful recovery tests quarterly
  - Backup retention: 30 days

#### NFR-008: Error Recovery

- **Requirement**: System shall recover gracefully from transient failures
- **Implementation**:
  - Exponential backoff retry logic
  - Circuit breaker patterns
  - Fallback mechanisms
  - Dead letter queues for failed events
- **Acceptance Criteria**:
  - 95% automatic recovery from transient errors
  - Manual intervention required <5% of time
  - No cascading failures

### 4.4 Security Requirements

#### NFR-009: Data Encryption

- **Requirement**: All data shall be encrypted at rest and in transit
- **Implementation**:
  - At rest: AES-256 encryption
  - In transit: TLS 1.3
  - Database encryption enabled
  - Encrypted S3 buckets
- **Acceptance Criteria**:
  - Zero unencrypted data storage
  - SSL certificate monitoring
  - Annual security audits pass

#### NFR-010: Authentication Security

- **Requirement**: Implement industry-standard authentication
- **Implementation**:
  - Password hashing: bcrypt (10+ rounds)
  - JWT token-based sessions
  - Optional MFA support
  - OAuth 2.0 integration
- **Acceptance Criteria**:
  - No plain-text password storage
  - Session tokens expire after 30 minutes
  - Failed login attempt limiting (5 attempts)

#### NFR-011: API Security

- **Requirement**: Protect APIs from unauthorized access and abuse
- **Implementation**:
  - API key authentication
  - Rate limiting (1000 req/hour per user)
  - IP whitelisting option
  - WAF protection
- **Acceptance Criteria**:
  - Zero unauthorized API access incidents
  - DDoS protection active
  - API abuse detection and blocking

#### NFR-012: Compliance

- **Requirement**: Comply with GDPR, CCPA, and SOC 2 standards
- **Implementation**:
  - Data processing agreements
  - Right to deletion workflows
  - Data export functionality
  - Audit logging
- **Acceptance Criteria**:
  - GDPR compliance certification
  - CCPA compliance verification
  - Annual SOC 2 audit pass

### 4.5 Usability Requirements

#### NFR-013: User Interface Simplicity

- **Requirement**: Non-technical users shall complete setup in <30 minutes
- **MVP Target**: <30 minutes
- **Final Target**: <10 minutes
- **Implementation**:
  - Guided onboarding wizard
  - Contextual help tooltips
  - Video tutorials
  - Pre-configured templates
- **Acceptance Criteria**:
  - 90% of users complete setup without support
  - User satisfaction score (NPS) >50
  - <5% support tickets related to setup

#### NFR-014: Dashboard Accessibility

- **Requirement**: Dashboard shall meet WCAG 2.1 Level AA standards
- **Implementation**:
  - Keyboard navigation support
  - Screen reader compatibility
  - High contrast mode
  - Minimum font size 14px
- **Acceptance Criteria**:
  - Pass automated accessibility testing
  - Manual accessibility audit pass
  - Support for assistive technologies

#### NFR-015: Mobile Responsiveness

- **Requirement**: Full functionality on mobile devices (iOS/Android)
- **Implementation**:
  - Responsive CSS framework
  - Mobile-optimized layouts
  - Touch-friendly interactions
  - Progressive web app capabilities
- **Acceptance Criteria**:
  - Usable on screens 375px+ wide
  - Touch targets minimum 44×44px
  - Fast load times on 3G networks

### 4.6 Maintainability Requirements

#### NFR-016: Code Quality

- **Requirement**: Maintain high code quality standards
- **Implementation**:
  - 80%+ unit test coverage
  - Automated code review (linting)
  - Documentation for all functions
  - Code style guide enforcement
- **Acceptance Criteria**:
  - Zero critical code smell issues
  - All functions documented
  - CI/CD pipelines pass

#### NFR-017: Monitoring and Logging

- **Requirement**: Comprehensive system observability
- **Implementation**:
  - CloudWatch logs for all services
  - Application performance monitoring (Datadog)
  - Error tracking (Sentry)
  - Business metrics dashboards
- **Acceptance Criteria**:
  - 100% service coverage
  - <5 minute mean time to detection (MTTD)
  - <30 minute mean time to resolution (MTTR)

#### NFR-018: Deployment Automation

- **Requirement**: Fully automated deployment pipeline
- **Implementation**:
  - Infrastructure as Code (Terraform)
  - Automated testing in CI/CD
  - Blue-green deployments
  - Automated rollback on failure
- **Acceptance Criteria**:
  - Zero-downtime deployments
  - <15 minute deployment time
  - 95%+ successful deployment rate

### 4.7 Portability Requirements

#### NFR-019: Cloud Platform Independence

- **Requirement**: Minimize AWS vendor lock-in
- **Implementation**:
  - Abstract cloud-specific services
  - Use open standards where possible
  - Document AWS-specific dependencies
  - Containerization for compute workloads
- **Acceptance Criteria**:
  - Migration plan documented
  - Critical services abstracted
  - <20% code changes required for migration

### 4.8 Cost Requirements

#### NFR-020: Operating Cost Efficiency

- **Requirement**: Maintain operating costs <$100 per restaurant monthly at scale
- **Current**: $82.70 per restaurant (50 restaurants)
- **Target**: <$75 per restaurant (500+ restaurants)
- **Implementation**:
  - Serverless architecture
  - Reserved instance pricing
  - Efficient API usage patterns
  - Automated cost monitoring
- **Acceptance Criteria**:
  - Monthly cost reports generated
  - Cost per restaurant decreases with scale
  - Gross margin >70%

---

## 5. Technical Architecture

### 5.1 System Architecture Overview

RestaurantGuard employs a serverless, event-driven architecture built on AWS services. The system consists of four primary layers:

1. **Presentation Layer**: React-based web application
2. **API Layer**: RESTful APIs via AWS API Gateway
3. **Application Layer**: AWS Lambda functions for business logic
4. **Data Layer**: PostgreSQL RDS, Redis cache, S3 storage

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   React     │  │  Dashboard  │  │   Mobile    │        │
│  │     Web     │  │     UI      │  │  Responsive │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓ HTTPS/TLS
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     AWS API Gateway + CloudFront CDN                 │  │
│  │  Authentication │ Rate Limiting │ Request Routing    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │   Crisis     │ │  Monitoring  │ │  Response    │       │
│  │  Detection   │ │    Lambda    │ │   Lambda     │       │
│  │   Lambda     │ │   Functions  │ │  Functions   │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         AWS Bedrock Nova Pro (AI Engine)             │  │
│  │   Root Cause Analysis │ Pattern Recognition │        │  │
│  │   Content Generation  │ Severity Scoring            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│  │ PostgreSQL │ │   Redis    │ │     S3     │             │
│  │    RDS     │ │   Cache    │ │  Storage   │             │
│  │  (Primary) │ │ (Session)  │ │  (Logs)    │             │
│  └────────────┘ └────────────┘ └────────────┘             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  External Integrations                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │   GMB    │ │  Search  │ │   Yelp   │ │  Twilio  │      │
│  │   API    │ │ Console  │ │   API    │ │   SMS    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Component Architecture

#### 5.2.1 Crisis Detection Agent

The Crisis Detection Agent is the core autonomous component:

**Components:**

- **Monitoring Loop**: Scheduled EventBridge trigger (15-minute intervals)
- **Metric Collector**: Aggregates data from GMB, GSC, reviews
- **Anomaly Detector**: Identifies deviations from baseline
- **Crisis Classifier**: Determines crisis type and severity
- **Alert Generator**: Creates and routes notifications

**Workflow:**

```python
class CrisisDetectionAgent:
    def __init__(self):
        self.bedrock_client = boto3.client('bedrock-runtime')
        self.monitoring_interval = 15  # minutes
        self.threshold_config = {
            'ranking_drop': 3,
            'traffic_loss': 0.2,
            'review_drop': 0.5
        }

    async def monitor_loop(self):
        """Main monitoring loop - runs every 15 minutes"""
        while True:
            restaurants = await self.get_active_restaurants()

            for restaurant in restaurants:
                try:
                    # Collect current metrics
                    metrics = await self.collect_metrics(restaurant)

                    # Detect crisis conditions
                    if self.detect_crisis(metrics):
                        # Analyze with AI
                        analysis = await self.analyze_crisis(restaurant, metrics)

                        # Trigger automated response
                        await self.trigger_response(restaurant, analysis)

                        # Log for learning
                        await self.update_knowledge_base(restaurant, metrics, analysis)

                except Exception as e:
                    logger.error(f"Error monitoring {restaurant.id}: {e}")
                    await self.handle_monitoring_error(restaurant, e)

            await asyncio.sleep(self.monitoring_interval * 60)

    def detect_crisis(self, metrics: dict) -> bool:
        """Crisis detection logic with multiple conditions"""
        conditions = [
            metrics.get('ranking_drop', 0) > self.threshold_config['ranking_drop'],
            metrics.get('traffic_loss', 0) > self.threshold_config['traffic_loss'],
            metrics.get('review_score_drop', 0) > self.threshold_config['review_drop'],
            metrics.get('gmb_suspended', False) == True
        ]
        return any(conditions)

    async def analyze_crisis(self, restaurant, metrics: dict) -> dict:
        """Analyze crisis using Bedrock Nova Pro"""
        prompt = self._build_analysis_prompt(restaurant, metrics)

        response = self.bedrock_client.invoke_model(
            modelId='anthropic.claude-3-nova-pro',
            body=json.dumps({
                'prompt': prompt,
                'max_tokens': 1000,
                'temperature': 0.3
            })
        )

        return self._parse_analysis_response(response)
```

**Data Flow:**

1. EventBridge triggers Lambda every 15 minutes
2. Lambda queries active restaurants from RDS
3. For each restaurant, collects metrics via API calls
4. Detects anomalies using threshold logic
5. Invokes Bedrock Nova Pro for root cause analysis
6. Generates alerts and automated responses
7. Updates knowledge base with learnings

#### 5.2.2 Automated Response System

**Components:**

- **Action Executor**: Executes GMB updates, content changes
- **Recovery Manager**: Tracks recovery progress
- **Verification Engine**: Confirms action success
- **Escalation Handler**: Routes to human when automation fails

**GMB Integration Module:**

```python
class GMBIntegration:
    def __init__(self):
        self.client = build('mybusinessbusinessinformation', 'v1')
        self.rate_limiter = RateLimiter(max_requests=10, time_window=60)

    async def get_location_metrics(self, place_id: str) -> dict:
        """Fetch current GMB metrics with rate limiting"""
        await self.rate_limiter.acquire()

        try:
            request = self.client.locations().get(
                name=f'locations/{place_id}'
            )
            return request.execute()
        except Exception as e:
            logger.error(f"GMB API error for {place_id}: {e}")
            raise

    async def update_business_hours(self, place_id: str, hours: list) -> dict:
        """Update business hours automatically"""
        await self.rate_limiter.acquire()

        body = {
            'regularHours': {
                'periods': hours
            }
        }

        request = self.client.locations().patch(
            name=f'locations/{place_id}',
            body=body,
            updateMask='regularHours'
        )
        return request.execute()

    async def optimize_profile(self, place_id: str, analysis: dict) -> dict:
        """Comprehensive profile optimization based on AI analysis"""
        tasks = []

        if analysis.get('missing_photos'):
            tasks.append(self.add_photos(place_id, analysis['photo_recommendations']))

        if analysis.get('outdated_hours'):
            tasks.append(self.update_business_hours(place_id, analysis['corrected_hours']))

        if analysis.get('incomplete_categories'):
            tasks.append(self.update_categories(place_id, analysis['recommended_categories']))

        results = await asyncio.gather(*tasks, return_exceptions=True)
        return self._summarize_optimization_results(results)
```

#### 5.2.3 AI Analysis Engine (Bedrock Nova Pro)

**Configuration:**

```python
BEDROCK_CONFIG = {
    'model_id': 'anthropic.claude-3-nova-pro',
    'max_tokens': 1000,
    'temperature': 0.3,  # Lower for consistent analysis
    'top_p': 0.9,
    'knowledge_base': {
        'id': 'restaurant-crisis-kb',
        'sources': [
            's3://restaurantguard/knowledge/seo-patterns/',
            's3://restaurantguard/knowledge/recovery-strategies/',
            's3://restaurantguard/knowledge/algorithm-updates/'
        ]
    },
    'action_groups': [
        {
            'name': 'gmb_actions',
            'lambda_arn': 'arn:aws:lambda:us-east-1:xxx:function:gmb-actions',
            'description': 'Execute GMB profile updates'
        },
        {
            'name': 'alert_actions',
            'lambda_arn': 'arn:aws:lambda:us-east-1:xxx:function:alert-actions',
            'description': 'Generate and send alerts'
        },
        {
            'name': 'content_actions',
            'lambda_arn': 'arn:aws:lambda:us-east-1:xxx:function:content-actions',
            'description': 'Update website content'
        }
    ]
}
```

**Prompt Engineering:**

```python
def build_crisis_analysis_prompt(restaurant: dict, metrics: dict) -> str:
    """Construct optimized prompt for crisis analysis"""
    return f"""
You are a restaurant SEO crisis analyst. Analyze the following situation:

Restaurant: {restaurant['name']} ({restaurant['cuisine_type']})
Location: {restaurant['city']}, {restaurant['state']}
Current Date: {datetime.now().strftime('%Y-%m-%d')}

Metrics (Last 24 Hours):
- Current Ranking: {metrics['current_ranking']} (Previous: {metrics['previous_ranking']})
- Ranking Change: {metrics['ranking_change']} positions
- Traffic Change: {metrics['traffic_change']}%
- Review Score: {metrics['review_score']} (Previous: {metrics['previous_review_score']})
- New Reviews: {metrics['new_reviews_count']} (Average sentiment: {metrics['avg_sentiment']})
- GMB Status: {metrics['gmb_status']}

Historical Context:
- 30-day average ranking: {metrics['avg_30day_ranking']}
- Seasonal pattern: {metrics['seasonal_pattern']}
- Recent algorithm updates: {metrics.get('algorithm_updates', 'None detected')}

Competitor Activity:
- Top 3 competitors: {', '.join(metrics.get('competitors', []))}
- Competitor ranking changes: {metrics.get('competitor_changes', 'No significant changes')}

Task: Provide a structured analysis in JSON format:
{{
  "crisis_detected": true/false,
  "severity": 1-10,
  "crisis_type": "ranking_drop|traffic_loss|review_crisis|gmb_issue|algorithm_update",
  "root_cause": "detailed explanation",
  "contributing_factors": ["factor1", "factor2"],
  "confidence": 0-100,
  "recommended_actions": [
    {{
      "action": "specific action to take",
      "priority": "critical|high|medium|low",
      "estimated_impact": "expected outcome",
      "execution_time": "immediate|1-3 days|1-2 weeks"
    }}
  ],
  "recovery_timeline": "estimated time to recover",
  "preventive_measures": ["measure1", "measure2"]
}}

Consider:
1. Is this a genuine crisis or normal variance?
2. Are there seasonal factors (holidays, weather, events)?
3. Is this part of a broader algorithm update?
4. What's the most likely root cause?
5. What actions will have the highest impact?
"""
```

### 5.3 Database Architecture

#### 5.3.1 PostgreSQL Schema

```sql
-- ============================================
-- Core Tables
-- ============================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'owner',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- Restaurants table
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    cuisine_type VARCHAR(100),
    gmb_place_id VARCHAR(255) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    phone VARCHAR(20),
    website VARCHAR(500),
    status VARCHAR(50) DEFAULT 'active',
    monitoring_enabled BOOLEAN DEFAULT true,
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    INDEX idx_owner (owner_id),
    INDEX idx_gmb_place_id (gmb_place_id),
    INDEX idx_status_monitoring (status, monitoring_enabled),
    INDEX idx_city_state (city, state)
);

-- Metrics tracking
CREATE TABLE metrics (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'ranking', 'traffic', 'reviews', 'gmb_status'
    metric_name VARCHAR(100),
    value JSONB NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    source VARCHAR(50), -- 'gmb_api', 'search_console', 'yelp', 'manual'

    INDEX idx_restaurant_timestamp (restaurant_id, timestamp DESC),
    INDEX idx_metric_type (metric_type),
    INDEX idx_timestamp (timestamp DESC)
);

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL, -- 'critical', 'warning', 'info'
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'acknowledged', 'resolved', 'dismissed'
    confidence_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW(),
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id),

    INDEX idx_restaurant_status (restaurant_id, status),
    INDEX idx_severity (severity),
    INDEX idx_created_at (created_at DESC)
);

-- Crisis responses
CREATE TABLE crisis_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- 'gmb_update', 'content_update', 'manual_intervention'
    action_data JSONB,
    success BOOLEAN,
    error_message TEXT,
    execution_time_ms INTEGER,
    executed_at TIMESTAMP DEFAULT NOW(),
    executed_by VARCHAR(50) DEFAULT 'system', -- 'system' or user_id

    INDEX idx_alert_id (alert_id),
    INDEX idx_action_type (action_type),
    INDEX idx_executed_at (executed_at DESC)
);

-- Knowledge base for learning
CREATE TABLE crisis_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_type VARCHAR(50) NOT NULL,
    pattern_signature JSONB NOT NULL,
    occurrence_count INTEGER DEFAULT 1,
    success_rate DECIMAL(5,2),
    avg_recovery_time_hours INTEGER,
    recommended_actions JSONB,
    last_seen TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),

    INDEX idx_pattern_type (pattern_type),
    INDEX idx_occurrence_count (occurrence_count DESC)
);

-- ============================================
-- Reporting Tables
-- ============================================

-- Daily reports
CREATE TABLE daily_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    metrics_summary JSONB NOT NULL,
    alerts_count INTEGER DEFAULT 0,
    actions_taken INTEGER DEFAULT 0,
    generated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(restaurant_id, report_date),
    INDEX idx_restaurant_date (restaurant_id, report_date DESC)
);

-- Competitive analysis
CREATE TABLE competitor_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    competitor_name VARCHAR(255),
    competitor_place_id VARCHAR(255),
    metrics JSONB,
    timestamp TIMESTAMP DEFAULT NOW(),

    INDEX idx_restaurant_timestamp (restaurant_id, timestamp DESC),
    INDEX idx_competitor_place_id (competitor_place_id)
);

-- ============================================
-- Configuration Tables
-- ============================================

-- Alert configurations
CREATE TABLE alert_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    thresholds JSONB,
    notification_channels JSONB, -- ['email', 'sms', 'dashboard']
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    INDEX idx_restaurant_enabled (restaurant_id, enabled)
);

-- API usage tracking
CREATE TABLE api_usage (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    api_name VARCHAR(50) NOT NULL,
    endpoint VARCHAR(255),
    request_count INTEGER DEFAULT 1,
    error_count INTEGER DEFAULT 0,
    total_latency_ms INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,

    UNIQUE(restaurant_id, api_name, date),
    INDEX idx_restaurant_date (restaurant_id, date DESC)
);

-- ============================================
-- Audit Tables
-- ============================================

-- Audit log
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),

    INDEX idx_user_timestamp (user_id, timestamp DESC),
    INDEX idx_resource (resource_type, resource_id)
);

-- ============================================
-- Functions and Triggers
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ language 'plpgsql';

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Views
-- ============================================

-- Active crises view
CREATE VIEW active_crises AS
SELECT
    a.id,
    a.restaurant_id,
    r.name AS restaurant_name,
    a.severity,
    a.type,
    a.title,
    a.created_at,
    a.confidence_score,
    COUNT(cr.id) AS response_attempts,
    MAX(cr.success) AS last_response_success
FROM alerts a
JOIN restaurants r ON a.restaurant_id = r.id
LEFT JOIN crisis_responses cr ON a.id = cr.alert_id
WHERE a.status = 'active'
GROUP BY a.id, r.name;

-- Restaurant health dashboard
CREATE VIEW restaurant_health AS
SELECT
    r.id,
    r.name,
    COUNT(DISTINCT CASE WHEN a.status = 'active' AND a.severity = 'critical' THEN a.id END) AS critical_alerts,
    COUNT(DISTINCT CASE WHEN a.status = 'active' AND a.severity = 'warning' THEN a.id END) AS warning_alerts,
    AVG(CASE WHEN m.metric_type = 'ranking' THEN (m.value->>'position')::INTEGER END) AS avg_ranking,
    MAX(m.timestamp) AS last_metric_update
FROM restaurants r
LEFT JOIN alerts a ON r.id = a.restaurant_id AND a.created_at > NOW() - INTERVAL '7 days'
LEFT JOIN metrics m ON r.id = m.restaurant_id AND m.timestamp > NOW() - INTERVAL '24 hours'
WHERE r.status = 'active'
GROUP BY r.id, r.name;
```

#### 5.3.2 Redis Cache Architecture

**Cache Structure:**

```python
# Cache key patterns
CACHE_KEYS = {
    # Restaurant data (TTL: 15 minutes)
    'restaurant': 'restaurant:{restaurant_id}',
    'restaurant_metrics': 'restaurant:{restaurant_id}:metrics',
    'restaurant_rankings': 'restaurant:{restaurant_id}:rankings',

    # User session (TTL: 30 minutes)
    'user_session': 'session:{user_id}',
    'user_settings': 'user:{user_id}:settings',

    # Alerts (TTL: 5 minutes)
    'active_alerts': 'alerts:active',
    'restaurant_alerts': 'restaurant:{restaurant_id}:alerts',

    # API rate limiting (TTL: 60 seconds)
    'api_rate_limit': 'ratelimit:{api_name}:{identifier}',

    # Aggregated data (TTL: 1 hour)
    'dashboard_summary': 'dashboard:{restaurant_id}:summary',
    'competitor_data': 'restaurant:{restaurant_id}:competitors'
}

# Cache implementation
class CacheManager:
    def __init__(self):
        self.redis = redis.Redis(
            host=os.getenv('REDIS_HOST'),
            port=6379,
            db=0,
            decode_responses=True
        )

    async def get_restaurant_metrics(self, restaurant_id: str) -> dict:
        """Get cached metrics or fetch from database"""
        cache_key = f'restaurant:{restaurant_id}:metrics'
        cached = self.redis.get(cache_key)

        if cached:
            return json.loads(cached)

        # Fetch from database
        metrics = await self.db.fetch_metrics(restaurant_id)

        # Cache for 15 minutes
        self.redis.setex(
            cache_key,
            900,  # 15 minutes
            json.dumps(metrics)
        )

        return metrics

    async def invalidate_restaurant_cache(self, restaurant_id: str):
        """Invalidate all cache entries for a restaurant"""
        pattern = f'restaurant:{restaurant_id}:*'
        keys = self.redis.keys(pattern)
        if keys:
            self.redis.delete(*keys)
```

### 5.4 API Architecture

#### 5.4.1 RESTful API Endpoints

**Authentication Endpoints:**

```
POST   /api/v1/auth/register        - Create new user account
POST   /api/v1/auth/login           - Authenticate user
POST   /api/v1/auth/logout          - End user session
POST   /api/v1/auth/refresh-token   - Refresh JWT token
POST   /api/v1/auth/forgot-password - Initiate password reset
POST   /api/v1/auth/reset-password  - Complete password reset
```

**Restaurant Management:**

```
GET    /api/v1/restaurants          - List user's restaurants
POST   /api/v1/restaurants          - Add new restaurant
GET    /api/v1/restaurants/{id}     - Get restaurant details
PUT    /api/v1/restaurants/{id}     - Update restaurant
DELETE /api/v1/restaurants/{id}     - Delete restaurant
POST   /api/v1/restaurants/{id}/verify-gmb - Verify GMB connection
```

**Metrics and Monitoring:**

```
GET    /api/v1/restaurants/{id}/metrics           - Current metrics
GET    /api/v1/restaurants/{id}/metrics/history   - Historical metrics
GET    /api/v1/restaurants/{id}/rankings          - Ranking data
GET    /api/v1/restaurants/{id}/traffic           - Traffic data
GET    /api/v1/restaurants/{id}/reviews           - Review data
```

**Alerts:**

```
GET    /api/v1/alerts                    - List all alerts
GET    /api/v1/alerts/{id}               - Get alert details
POST   /api/v1/alerts/{id}/acknowledge   - Acknowledge alert
POST   /api/v1/alerts/{id}/resolve       - Mark alert resolved
POST   /api/v1/alerts/{id}/dismiss       - Dismiss alert
GET    /api/v1/restaurants/{id}/alerts   - Restaurant-specific alerts
```

**Reports:**

```
GET    /api/v1/reports/daily/{restaurant_id}     - Daily report
GET    /api/v1/reports/weekly/{restaurant_id}    - Weekly report
GET    /api/v1/reports/monthly/{restaurant_id}   - Monthly report
GET    /api/v1/reports/competitive/{restaurant_id} - Competitive analysis
POST   /api/v1/reports/generate/{restaurant_id}  - Generate custom report
```

**Settings:**

```
GET    /api/v1/settings                         - Get user settings
PUT    /api/v1/settings                         - Update user settings
GET    /api/v1/settings/notifications           - Get notification preferences
PUT    /api/v1/settings/notifications           - Update notification preferences
GET    /api/v1/settings/alerts/{restaurant_id}  - Get alert thresholds
PUT    /api/v1/settings/alerts/{restaurant_id}  - Update alert thresholds
```

#### 5.4.2 API Request/Response Examples

**Example: Get Restaurant Metrics**

Request:

```http
GET /api/v1/restaurants/550e8400-e29b-41d4-a716-446655440000/metrics HTTP/1.1
Host: api.restaurantguard.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
```

Response:

```json
{
  "status": "success",
  "data": {
    "restaurant_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-10-01T14:30:00Z",
    "metrics": {
      "ranking": {
        "current": 3,
        "previous": 3,
        "change": 0,
        "trend": "stable"
      },
      "traffic": {
        "views_24h": 1250,
        "views_previous_24h": 1180,
        "change_percent": 5.93,
        "trend": "increasing"
      },
      "reviews": {
        "score": 4.6,
        "count": 342,
        "new_24h": 3,
        "avg_sentiment": 0.82
      },
      "gmb_status": {
        "status": "verified",
        "last_updated": "2025-10-01T12:00:00Z",
        "profile_completeness": 95
      }
    },
    "health_score": 87,
    "alerts_count": {
      "critical": 0,
      "warning": 1,
      "info": 2
    }
  }
}
```

**Example: Create Alert**

Request:

```http
POST /api/v1/alerts HTTP/1.1
Host: api.restaurantguard.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "restaurant_id": "550e8400-e29b-41d4-a716-446655440000",
  "severity": "warning",
  "type": "ranking_drop",
  "title": "Ranking Drop Detected",
  "message": "Your restaurant ranking dropped from #3 to #5 for 'Italian restaurant near me'",
  "data": {
    "previous_ranking": 3,
    "current_ranking": 5,
    "keyword": "Italian restaurant near me",
    "location": "San Diego, CA"
  },
  "confidence_score": 92.5
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "alert_id": "660e9511-f30c-52e5-b827-557766551111",
    "created_at": "2025-10-01T14:35:00Z",
    "notification_sent": true,
    "automated_response_triggered": true
  }
}
```

### 5.5 Lambda Function Architecture

#### 5.5.1 Core Lambda Functions

**Crisis Detection Lambda:**

```python
# lambda_crisis_detection.py
import json
import boto3
import os
from datetime import datetime
from typing import Dict, List

bedrock = boto3.client('bedrock-runtime')
rds = boto3.client('rds-data')
sns = boto3.client('sns')

def lambda_handler(event, context):
    """
    Main Lambda entry point for crisis detection
    Triggered by EventBridge every 15 minutes
    """
    try:
        # Get list of active restaurants
        restaurants = get_active_restaurants()

        results = {
            'processed': 0,
            'crises_detected': 0,
            'alerts_generated': 0,
            'errors': []
        }

        for restaurant in restaurants:
            try:
                # Collect metrics
                metrics = collect_restaurant_metrics(restaurant)

                # Detect crisis
                crisis_detected, analysis = detect_and_analyze_crisis(restaurant, metrics)

                if crisis_detected:
                    # Generate alert
                    alert_id = create_alert(restaurant, analysis)

                    # Trigger automated response
                    trigger_automated_response(restaurant, alert_id, analysis)

                    results['crises_detected'] += 1
                    results['alerts_generated'] += 1

                results['processed'] += 1

            except Exception as e:
                results['errors'].append({
                    'restaurant_id': restaurant['id'],
                    'error': str(e)
                })

        return {
            'statusCode': 200,
            'body': json.dumps(results)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def get_active_restaurants() -> List[Dict]:
    """Fetch active restaurants from RDS"""
    sql = """
    SELECT id, name, gmb_place_id, owner_id
    FROM restaurants
    WHERE status = 'active'
    AND monitoring_enabled = true
    """

    response = rds.execute_statement(
        resourceArn=os.environ['DB_ARN'],
        secretArn=os.environ['DB_SECRET_ARN'],
        database=os.environ['DB_NAME'],
        sql=sql
    )

    return parse_rds_response(response)

def collect_restaurant_metrics(restaurant: Dict) -> Dict:
    """Collect metrics from multiple sources"""
    return {
        'gmb_data': fetch_gmb_metrics(restaurant['gmb_place_id']),
        'search_console': fetch_search_console_data(restaurant['id']),
        'reviews': fetch_review_data(restaurant['gmb_place_id']),
        'historical': fetch_historical_metrics(restaurant['id'])
    }

def detect_and_analyze_crisis(restaurant: Dict, metrics: Dict) -> tuple:
    """Detect crisis and analyze with Bedrock Nova Pro"""
    # Quick threshold check
    crisis_indicators = {
        'ranking_drop': metrics['gmb_data']['ranking_change'] > 3,
        'traffic_loss': metrics['gmb_data']['traffic_change'] < -0.2,
        'review_drop': metrics['reviews']['score_change'] < -0.5,
        'gmb_suspended': metrics['gmb_data']['status'] != 'verified'
    }

    if not any(crisis_indicators.values()):
        return False, None

    # Invoke Bedrock for detailed analysis
    prompt = build_analysis_prompt(restaurant, metrics, crisis_indicators)

    response = bedrock.invoke_model(
        modelId='anthropic.claude-3-nova-pro',
        body=json.dumps({
            'prompt': prompt,
            'max_tokens': 1000,
            'temperature': 0.3
        })
    )

    analysis = parse_bedrock_response(response)

    return analysis['crisis_detected'], analysis

def create_alert(restaurant: Dict, analysis: Dict) -> str:
    """Create alert in database and send notifications"""
    alert_id = str(uuid.uuid4())

    sql = """
    INSERT INTO alerts
    (id, restaurant_id, severity, type, title, message, data, confidence_score)
    VALUES (:id, :restaurant_id, :severity, :type, :title, :message, :data, :confidence)
    """

    rds.execute_statement(
        resourceArn=os.environ['DB_ARN'],
        secretArn=os.environ['DB_SECRET_ARN'],
        database=os.environ['DB_NAME'],
        sql=sql,
        parameters=[
            {'name': 'id', 'value': {'stringValue': alert_id}},
            {'name': 'restaurant_id', 'value': {'stringValue': restaurant['id']}},
            {'name': 'severity', 'value': {'stringValue': analysis['severity']}},
            {'name': 'type', 'value': {'stringValue': analysis['crisis_type']}},
            {'name': 'title', 'value': {'stringValue': analysis['title']}},
            {'name': 'message', 'value': {'stringValue': analysis['message']}},
            {'name': 'data', 'value': {'stringValue': json.dumps(analysis)}},
            {'name': 'confidence', 'value': {'doubleValue': analysis['confidence']}}
        ]
    )

    # Send notification
    send_notification(restaurant, analysis)

    return alert_id

def trigger_automated_response(restaurant: Dict, alert_id: str, analysis: Dict):
    """Trigger automated response Lambda"""
    lambda_client = boto3.client('lambda')

    payload = {
        'restaurant': restaurant,
        'alert_id': alert_id,
        'analysis': analysis
    }

    lambda_client.invoke(
        FunctionName=os.environ['RESPONSE_LAMBDA_ARN'],
        InvocationType='Event',  # Asynchronous
        Payload=json.dumps(payload)
    )
```

**Automated Response Lambda:**

```python
# lambda_automated_response.py
import json
import boto3
from google.oauth2 import service_account
from googleapiclient.discovery import build

def lambda_handler(event, context):
    """
    Execute automated response actions based on crisis analysis
    """
    restaurant = event['restaurant']
    alert_id = event['alert_id']
    analysis = event['analysis']

    results = {
        'alert_id': alert_id,
        'actions_executed': [],
        'actions_failed': [],
        'success_rate': 0
    }

    try:
        # Execute recommended actions
        for action in analysis['recommended_actions']:
            if action['priority'] in ['critical', 'high']:
                try:
                    if action['action_type'] == 'gmb_update':
                        execute_gmb_update(restaurant, action)
                        results['actions_executed'].append(action['action_type'])

                    elif action['action_type'] == 'content_update':
                        execute_content_update(restaurant, action)
                        results['actions_executed'].append(action['action_type'])

                    # Log successful action
                    log_crisis_response(alert_id, action, success=True)

                except Exception as e:
                    results['actions_failed'].append({
                        'action': action['action_type'],
                        'error': str(e)
                    })
                    log_crisis_response(alert_id, action, success=False, error=str(e))

        # Calculate success rate
        total = len(results['actions_executed']) + len(results['actions_failed'])
        if total > 0:
            results['success_rate'] = len(results['actions_executed']) / total * 100

        return {
            'statusCode': 200,
            'body': json.dumps(results)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def execute_gmb_update(restaurant: dict, action: dict):
    """Execute GMB profile updates"""
    credentials = service_account.Credentials.from_service_account_file(
        'gmb_credentials.json',
        scopes=['https://www.googleapis.com/auth/business.manage']
    )

    service = build('mybusinessbusinessinformation', 'v1', credentials=credentials)

    if action['update_type'] == 'business_hours':
        update_business_hours(service, restaurant['gmb_place_id'], action['data'])

    elif action['update_type'] == 'categories':
        update_categories(service, restaurant['gmb_place_id'], action['data'])

    elif action['update_type'] == 'attributes':
        update_attributes(service, restaurant['gmb_place_id'], action['data'])

def log_crisis_response(alert_id: str, action: dict, success: bool, error: str = None):
    """Log response action to database"""
    rds = boto3.client('rds-data')

    sql = """
    INSERT INTO crisis_responses
    (alert_id, action_type, action_data, success, error_message)
    VALUES (:alert_id, :action_type, :action_data, :success, :error_message)
    """

    rds.execute_statement(
        resourceArn=os.environ['DB_ARN'],
        secretArn=os.environ['DB_SECRET_ARN'],
        database=os.environ['DB_NAME'],
        sql=sql,
        parameters=[
            {'name': 'alert_id', 'value': {'stringValue': alert_id}},
            {'name': 'action_type', 'value': {'stringValue': action['action_type']}},
            {'name': 'action_data', 'value': {'stringValue': json.dumps(action)}},
            {'name': 'success', 'value': {'booleanValue': success}},
            {'name': 'error_message', 'value': {'stringValue': error or ''}}
        ]
    )
```

#### 5.5.2 Lambda Configuration

**Memory and Timeout Settings:**

```yaml
CrisisDetectionLambda:
  MemorySize: 512 MB
  Timeout: 300 seconds (5 minutes)
  ReservedConcurrentExecutions: 10
  Environment:
    BEDROCK_MODEL_ID: anthropic.claude-3-nova-pro
    DB_ARN: arn:aws:rds:us-east-1:xxx:cluster:restaurantguard-db
    DB_SECRET_ARN: arn:aws:secretsmanager:xxx
    DB_NAME: restaurantguard

AutomatedResponseLambda:
  MemorySize: 256 MB
  Timeout: 180 seconds (3 minutes)
  ReservedConcurrentExecutions: 20
  Environment:
    GMB_CREDENTIALS_SECRET: arn:aws:secretsmanager:xxx

APILambda:
  MemorySize: 512 MB
  Timeout: 30 seconds
  ReservedConcurrentExecutions: 50
  Environment:
    REDIS_HOST: restaurantguard-cache.xxx.cache.amazonaws.com
```

### 5.6 Integration Architecture

#### 5.6.1 Google My Business API

**Authentication Flow:**

```python
class GMBAuthManager:
    def __init__(self):
        self.credentials = None
        self.token_expiry = None

    def get_authenticated_service(self):
        """Get authenticated GMB API service"""
        if self._is_token_expired():
            self._refresh_credentials()

        return build(
            'mybusinessbusinessinformation',
            'v1',
            credentials=self.credentials
        )

    def _refresh_credentials(self):
        """Refresh OAuth2 credentials"""
        # Load from Secrets Manager
        secrets_client = boto3.client('secretsmanager')
        secret = secrets_client.get_secret_value(
            SecretId=os.environ['GMB_CREDENTIALS_SECRET']
        )

        creds_data = json.loads(secret['SecretString'])

        self.credentials = service_account.Credentials.from_service_account_info(
            creds_data,
            scopes=['https://www.googleapis.com/auth/business.manage']
        )

        self.token_expiry = datetime.now() + timedelta(hours=1)
```

**Rate Limiting Strategy:**

```python
class GMBRateLimiter:
    def __init__(self):
        self.redis = redis.Redis(host=os.environ['REDIS_HOST'])
        self.limits = {
            'read': {'max': 300, 'window': 60},      # 300 requests per minute
            'write': {'max': 10, 'window': 60}        # 10 edits per minute per listing
        }

    async def acquire(self, operation_type: str, place_id: str = None):
        """Acquire rate limit token"""
        limit_config = self.limits[operation_type]

        # Global rate limit
        global_key = f'ratelimit:gmb:{operation_type}'
        global_count = self.redis.incr(global_key)

        if global_count == 1:
            self.redis.expire(global_key, limit_config['window'])

        if global_count > limit_config['max']:
            wait_time = self.redis.ttl(global_key)
            raise RateLimitExceeded(f'Wait {wait_time} seconds')

        # Per-listing rate limit for writes
        if operation_type == 'write' and place_id:
            listing_key = f'ratelimit:gmb:write:{place_id}'
            listing_count = self.redis.incr(listing_key)

            if listing_count == 1:
                self.redis.expire(listing_key, limit_config['window'])

            if listing_count > limit_config['max']:
                wait_time = self.redis.ttl(listing_key)
                raise RateLimitExceeded(f'Wait {wait_time} seconds for listing {place_id}')
```

#### 5.6.2 Third-Party API Integrations

**Yelp Fusion API:**

```python
class YelpIntegration:
    def __init__(self):
        self.api_key = os.environ['YELP_API_KEY']
        self.base_url = 'https://api.yelp.com/v3'
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.api_key}'
        })

    async def get_business_details(self, business_id: str) -> dict:
        """Fetch business details from Yelp"""
        url = f'{self.base_url}/businesses/{business_id}'

        response = self.session.get(url)
        response.raise_for_status()

        return response.json()

    async def get_reviews(self, business_id: str) -> list:
        """Fetch reviews from Yelp"""
        url = f'{self.base_url}/businesses/{business_id}/reviews'

        response = self.session.get(url)
        response.raise_for_status()

        return response.json()['reviews']
```

**SendGrid Email Integration:**

```python
class EmailNotificationService:
    def __init__(self):
        self.sg = sendgrid.SendGridAPIClient(
            api_key=os.environ['SENDGRID_API_KEY']
        )

    async def send_alert_email(self, user: dict, alert: dict):
        """Send alert notification email"""
        message = Mail(
            from_email='alerts@restaurantguard.com',
            to_emails=user['email'],
            subject=f'[{alert["severity"].upper()}] {alert["title"]}',
            html_content=self._render_email_template(alert)
        )

        try:
            response = self.sg.send(message)
            return response.status_code == 202
        except Exception as e:
            logger.error(f'Email send failed: {e}')
            return False

    def _render_email_template(self, alert: dict) -> str:
        """Render HTML email template"""
        template = f"""
        <html>
          <body>
            <h2>{alert['title']}</h2>
            <p><strong>Severity:</strong> {alert['severity']}</p>
            <p><strong>Detected:</strong> {alert['created_at']}</p>
            <p>{alert['message']}</p>

            <h3>Recommended Actions:</h3>
            <ul>
              {self._format_actions(alert.get('data', {}).get('recommended_actions', []))}
            </ul>

            <p>
              <a href="https://app.restaurantguard.com/alerts/{alert['id']}">
                View Details in Dashboard
              </a>
            </p>
          </body>
        </html>
        """
        return template
```

**Twilio SMS Integration:**

```python
class SMSNotificationService:
    def __init__(self):
        self.client = Client(
            os.environ['TWILIO_ACCOUNT_SID'],
            os.environ['TWILIO_AUTH_TOKEN']
        )
        self.from_number = os.environ['TWILIO_PHONE_NUMBER']

    async def send_alert_sms(self, user: dict, alert: dict):
        """Send SMS alert notification"""
        if alert['severity'] != 'critical':
            return  # Only send SMS for critical alerts

        message_body = f"""
RestaurantGuard ALERT

{alert['title']}

{alert['message'][:100]}...

View: https://app.restaurantguard.com/alerts/{alert['id']}
        """.strip()

        try:
            message = self.client.messages.create(
                body=message_body,
                from_=self.from_number,
                to=user['phone']
            )
            return message.sid
        except Exception as e:
            logger.error(f'SMS send failed: {e}')
            return None
```

---

## 6. Data Management

### 6.1 Data Collection Strategy

#### 6.1.1 Data Sources

| Source                 | Frequency  | Data Type                           | Priority |
| ---------------------- | ---------- | ----------------------------------- | -------- |
| Google My Business API | 15 minutes | Rankings, views, actions            | Critical |
| Google Search Console  | Daily      | Search queries, impressions, clicks | High     |
| Yelp API               | 1 hour     | Reviews, ratings, photos            | Medium   |
| TripAdvisor API        | 1 hour     | Reviews, rankings                   | Medium   |
| Social Media APIs      | 1 hour     | Mentions, sentiment                 | Low      |
| Website Analytics      | Real-time  | Traffic, conversions                | High     |

#### 6.1.2 Data Processing Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Ingestion Layer                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   GMB    │  │  Search  │  │   Yelp   │  │  Social  │   │
│  │   API    │  │ Console  │  │   API    │  │  Media   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Data Validation Layer                      │
│  • Schema validation                                        │
│  • Duplicate detection                                      │
│  • Data quality checks                                      │
│  • Anomaly flagging                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Data Transformation Layer                  │
│  • Normalization                                            │
│  • Aggregation                                              │
│  • Feature extraction                                       │
│  • Enrichment                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Storage Layer                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │   RDS    │  │   Redis  │  │    S3    │                 │
│  │ (Primary)│  │  (Cache) │  │ (Archive)│                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Data Retention Policies

| Data Type          | Hot Storage (RDS) | Warm Storage (S3) | Cold Storage (Glacier) |
| ------------------ | ----------------- | ----------------- | ---------------------- |
| Real-time metrics  | 90 days           | 1 year            | 7 years                |
| Alerts             | 1 year            | 3 years           | 7 years                |
| Historical trends  | 2 years           | 5 years           | Indefinite             |
| User activity logs | 30 days           | 1 year            | 7 years (compliance)   |
| API logs           | 7 days            | 30 days           | 1 year                 |
| Crisis responses   | 1 year            | 3 years           | 7 years                |

### 6.3 Data Privacy and Security

#### 6.3.1 Data Classification

**Sensitive Data (PII):**

- User email addresses
- Phone numbers
- Restaurant addresses
- Payment information

**Confidential Data:**

- GMB credentials
- API keys
- Business metrics
- Competitive intelligence

**Public Data:**

- Restaurant names
- Public reviews
- General statistics

#### 6.3.2 Encryption Strategy

```python
class DataEncryptionService:
    def __init__(self):
        self.kms_client = boto3.client('kms')
        self.master_key_id = os.environ['KMS_MASTER_KEY_ID']

    def encrypt_sensitive_data(self, plaintext: str) -> str:
        """Encrypt sensitive data using AWS KMS"""
        response = self.kms_client.encrypt(
            KeyId=self.master_key_id,
            Plaintext=plaintext.encode('utf-8')
        )

        # Return base64 encoded ciphertext
        return base64.b64encode(response['CiphertextBlob']).decode('utf-8')

    def decrypt_sensitive_data(self, ciphertext: str) -> str:
        """Decrypt sensitive data"""
        response = self.kms_client.decrypt(
            CiphertextBlob=base64.b64decode(ciphertext)
        )

        return response['Plaintext'].decode('utf-8')
```

### 6.4 Backup and Disaster Recovery

#### 6.4.1 Backup Strategy

**Database Backups:**

- Automated daily snapshots (retained 30 days)
- Point-in-time recovery enabled (5-minute granularity)
- Cross-region replication to us-west-2
- Monthly manual snapshots (retained 1 year)

**Application Backups:**

- Lambda function versioning enabled
- Infrastructure as Code in Git
- Configuration backups to S3
- Secrets in AWS Secrets Manager with versioning

#### 6.4.2 Recovery Objectives

| Component        | RTO (Recovery Time) | RPO (Recovery Point)              |
| ---------------- | ------------------- | --------------------------------- |
| Database         | 15 minutes          | 5 minutes                         |
| Lambda functions | 5 minutes           | 0 (version controlled)            |
| API Gateway      | 5 minutes           | 0 (IaC)                           |
| Redis cache      | 10 minutes          | 15 minutes (acceptable data loss) |
| S3 storage       | 30 minutes          | 0 (versioned)                     |

---

## 7. External Integrations

### 7.1 Google APIs

#### 7.1.1 Google My Business API Integration

**API Endpoints Used:**

```
GET  /v1/accounts/{accountId}/locations
GET  /v1/{name=accounts/*/locations/*}
PATCH /v1/{location.name=accounts/*/locations/*}
POST /v1/{parent=accounts/*/locations/*}/media
GET  /v1/{name=accounts/*/locations/*/reviews}
```

**Rate Limits:**

- Global: 300 requests per minute
- Per-listing edits: 10 per minute
- Media uploads: 50 per day per listing

**Error Handling:**

```python
class GMBAPIErrorHandler:
    def handle_api_error(self, error):
        """Handle GMB API errors with appropriate fallback"""
        if error.resp.status == 429:  # Rate limit exceeded
            retry_after = int(error.resp.get('Retry-After', 60))
            raise RateLimitError(f'Retry after {retry_after} seconds')

        elif error.resp.status == 403:  # Permission denied
            logger.error('GMB API permission denied - check credentials')
            raise AuthenticationError('Invalid GMB credentials')

        elif error.resp.status == 404:  # Listing not found
            logger.warning(f'GMB listing not found: {error}')
            raise ResourceNotFoundError('GMB listing does not exist')

        elif error.resp.status >= 500:  # Server error
            logger.error(f'GMB API server error: {error}')
            raise ServerError('GMB API temporarily unavailable')

        else:
            logger.error(f'Unexpected GMB API error: {error}')
            raise APIError(f'GMB API error: {error}')
```

#### 7.1.2 Google Search Console API Integration

**API Endpoints Used:**

```
GET /v1/urlInspection/index:inspect
POST /v1/webmasters/searchAnalytics/query
GET /v1/webmasters/sitemaps
```

**Data Delay Considerations:**

- Search analytics data: 2-3 day delay
- Not suitable for real-time detection
- Used for trend analysis and validation

**Query Example:**

```python
def fetch_search_analytics(site_url: str, start_date: str, end_date: str):
    """Fetch Search Console analytics data"""
    request = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': ['query', 'page', 'device'],
        'rowLimit': 25000,
        'startRow': 0
    }

    service = build('searchconsole', 'v1', credentials=credentials)
    response = service.searchanalytics().query(
        siteUrl=site_url,
        body=request
    ).execute()

    return response.get('rows', [])
```

### 7.2 Review Platform APIs

#### 7.2.1 Yelp Fusion API

**Pricing Tiers:**

- Free tier: 500 API calls per day
- Premium: $14.13 per 1,000 calls
- Estimated monthly cost (50 restaurants, hourly checks): ~$2,035

**API Calls:**

```python
class YelpMonitoring:
    def __init__(self):
        self.api_key = os.environ['YELP_API_KEY']
        self.base_url = 'https://api.yelp.com/v3'

    async def monitor_restaurant_reviews(self, business_id: str) -> dict:
        """Monitor Yelp reviews for changes"""
        # Fetch current reviews
        reviews = await self.get_reviews(business_id)

        # Check for new reviews
        cached_reviews = await self.get_cached_reviews(business_id)
        new_reviews = self.identify_new_reviews(reviews, cached_reviews)

        if new_reviews:
            # Analyze sentiment
            sentiment_analysis = await self.analyze_sentiment(new_reviews)

            # Check for review velocity spike
            velocity_spike = self.detect_velocity_anomaly(business_id, len(new_reviews))

            return {
                'new_review_count': len(new_reviews),
                'avg_sentiment': sentiment_analysis['avg_score'],
                'velocity_spike': velocity_spike,
                'flagged_reviews': sentiment_analysis['negative_reviews']
            }

        return {'new_review_count': 0}
```

#### 7.2.2 TripAdvisor Content API

**Integration Notes:**

- Requires partnership agreement
- More restrictive than Yelp
- Used for competitive analysis (Post-MVP)

### 7.3 Notification Services

#### 7.3.1 SendGrid Email API

**Configuration:**

```python
SENDGRID_CONFIG = {
    'api_key': os.environ['SENDGRID_API_KEY'],
    'from_email': 'alerts@restaurantguard.com',
    'from_name': 'RestaurantGuard Alerts',
    'templates': {
        'crisis_alert': 'd-123456789abcdef',
        'daily_report': 'd-987654321fedcba',
        'weekly_summary': 'd-abcdef123456789'
    },
    'categories': ['alerts', 'reports', 'notifications']
}
```

**Monthly Cost Estimate:**

- Free tier: 100 emails/day
- Essentials: $19.95/month for 50,000 emails
- Estimated usage (50 restaurants): ~10,000 emails/month
- Cost: $19.95/month

#### 7.3.2 Twilio SMS API

**Configuration:**

```python
TWILIO_CONFIG = {
    'account_sid': os.environ['TWILIO_ACCOUNT_SID'],
    'auth_token': os.environ['TWILIO_AUTH_TOKEN'],
    'from_number': '+1-555-RESTAURANT',
    'sms_enabled_for_severity': ['critical']  # Only critical alerts via SMS
}
```

**Monthly Cost Estimate:**

- $0.0079 per SMS (US)
- Estimated usage: 200 SMS/month (critical alerts only)
- Cost: ~$1.58/month

---

## 8. User Interface Requirements

### 8.1 Dashboard Design

#### 8.1.1 Main Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  RestaurantGuard Logo    Dashboard  Alerts  Reports  [User]│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Restaurant: Joe's Italian Kitchen        ▼ [Switch]        │
│  Last Updated: 2 minutes ago                                │
└─────────────────────────────────────────────────────────────┘
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  📊 Ranking  │  👁 Traffic  │  ⭐ Reviews  │  💰 Revenue  │
│     #3       │   +12.3%     │    4.6/5.0   │   $45.2K     │
│   ↑ +0      │   📈 Rising  │   ↑ +0.1     │   ↑ +8.5%    │
└──────────────┴──────────────┴──────────────┴──────────────┘
┌─────────────────────────────────────────────────────────────┐
│  🚨 Active Alerts (2)                          [View All →] │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ⚠️ WARNING │ Ranking Drop Detected                    │ │
│  │ 2 hours ago │ Your ranking dropped from #3 to #5 for  │ │
│  │            │ "Italian restaurant near me"             │ │
│  │            │ [View Details] [Acknowledge]             │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ℹ️ INFO │ New Competitor Analysis Available           │ │
│  │ 5 hours ago │ Weekly competitive benchmarking ready   │ │
│  │            │ [View Report]                            │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌───────────────────────────┬─────────────────────────────────┐
│   📈 Ranking Trend (7d)   │   📊 Traffic Overview (30d)     │
│                           │                                 │
│   [Line Chart]            │   [Bar Chart]                   │
│                           │                                 │
└───────────────────────────┴─────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│   Recent Activity                            [View All →]   │
│   • GMB profile updated automatically        2 hours ago    │
│   • New review received (4.5 stars)          3 hours ago    │
│   • Competitor ranking change detected       5 hours ago    │
│   • Daily report generated                   8 hours ago    │
└─────────────────────────────────────────────────────────────┘
```

#### 8.1.2 Responsive Design Breakpoints

| Device        | Breakpoint     | Layout Changes                         |
| ------------- | -------------- | -------------------------------------- |
| Mobile        | < 768px        | Single column, collapsible sections    |
| Tablet        | 768px - 1024px | Two column grid, simplified charts     |
| Desktop       | > 1024px       | Full layout with all widgets           |
| Large Desktop | > 1440px       | Expanded charts and additional details |

### 8.2 Alert Management Interface

#### 8.2.1 Alert Detail View

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  🔴 CRITICAL ALERT                                          │
│  Ranking Drop Detected                                       │
│  Created: Oct 1, 2025 at 2:35 PM                           │
│  Status: Active                                             │
│                                                             │
│  [Acknowledge] [Mark Resolved] [Dismiss] [View History]    │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  📋 Alert Details                                           │
│  ───────────────────────────────────────────────────────── │
│  Severity: Critical (9/10)                                  │
│  Confidence: 92.5%                                          │
│  Root Cause: Negative review spike + competitor activity    │
│                                                             │
│  Impact Analysis:                                           │
│  • Ranking dropped from #3 to #8 (5 positions)             │
│  • Estimated revenue impact: -$1,200/week                   │
│  • Traffic loss: -35% in last 24 hours                     │
│  • 3 new negative reviews (avg 2.3 stars)                  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  🔧 Automated Actions Taken                                 │
│  ───────────────────────────────────────────────────────── │
│  ✓ GMB profile updated (2:40 PM)                           │
│  ✓ Business hours corrected (2:42 PM)                      │
│  ✓ New photos added (2:45 PM)                              │
│  ⏳ Content optimization in progress                        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  💡 Recommended Actions                                     │
│  ───────────────────────────────────────────────────────── │
│  1. [HIGH] Respond to negative reviews within 24 hours      │
│  2. [HIGH] Post GMB update highlighting recent improvements │
│  3. [MEDIUM] Review menu accuracy on website                │
│  4. [LOW] Schedule photos update next week                  │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Reporting Interface

#### 8.3.1 Daily Report View

**Report Components:**

- Executive summary (key metrics)
- Ranking changes visualization
- Traffic trend analysis
- Review summary
- Competitive positioning
- Action items and recommendations

### 8.4 Settings and Configuration

#### 8.4.1 Alert Threshold Configuration

```
┌─────────────────────────────────────────────────────────────┐
│  Alert Thresholds                                           │
│  ───────────────────────────────────────────────────────── │
│                                                             │
│  Ranking Drop Threshold:    [3] positions                   │
│  Sensitivity: ○ Low  ◉ Medium  ○ High                      │
│                                                             │
│  Traffic Loss Threshold:    [20] %                          │
│  Sensitivity: ○ Low  ◉ Medium  ○ High                      │
│                                                             │
│  Review Score Drop:         [0.5] stars                     │
│  Sensitivity: ○ Low  ◉ Medium  ○ High                      │
│                                                             │
│  [Save Changes] [Reset to Defaults]                        │
└─────────────────────────────────────────────────────────────┘
```

#### 8.4.2 Notification Preferences

**Channel Configuration:**

- Email notifications (always enabled)
- SMS notifications (critical alerts only)
- Dashboard notifications (all alerts)
- Webhook integrations (custom)

---

## 9. Security and Compliance

### 9.1 Authentication and Authorization

#### 9.1.1 Authentication Methods

**Primary Authentication:**

- Email/password with bcrypt hashing (10+ rounds)
- JWT tokens for session management
- Token expiration: 30 minutes
- Refresh token rotation

**Multi-Factor Authentication (Optional):**

- Time-based One-Time Passwords (TOTP)
- SMS verification
- Email verification codes

#### 9.1.2 Authorization Model

**Role Hierarchy:**

```
Super Admin
    │
    ├── Account Owner
    │       │
    │       ├── Manager
    │       │       │
    │       │       └── Viewer
    │       │
    │       └── Viewer
    │
    └── Support Staff
```

**Permission Matrix:**

| Action                 | Owner | Manager | Viewer | Support |
| ---------------------- | ----- | ------- | ------ | ------- |
| View Dashboard         | ✓     | ✓       | ✓      | ✓       |
| View Alerts            | ✓     | ✓       | ✓      | ✓       |
| Acknowledge Alerts     | ✓     | ✓       | ✗      | ✓       |
| Resolve Alerts         | ✓     | ✓       | ✗      | ✓       |
| Modify Settings        | ✓     | ✓       | ✗      | ✗       |
| Add/Remove Restaurants | ✓     | ✗       | ✗      | ✗       |
| Manage Users           | ✓     | ✗       | ✗      | ✗       |
| View Billing           | ✓     | ✗       | ✗      | ✗       |
| Access Support Tools   | ✗     | ✗       | ✗      | ✓       |

### 9.2 Data Security

#### 9.2.1 Encryption Standards

**Data at Rest:**

- Database: AWS RDS encryption (AES-256)
- S3 buckets: Server-side encryption (SSE-S3)
- Secrets: AWS Secrets Manager with KMS
- Backups: Encrypted snapshots

**Data in Transit:**

- TLS 1.3 for all API communications
- HTTPS only (HTTP redirects)
- Certificate pinning for mobile apps
- VPC private subnets for internal communication

#### 9.2.2 API Security

**API Gateway Configuration:**

```yaml
APIGateway:
  ThrottleSettings:
    RateLimit: 1000 # requests per second
    BurstLimit: 2000

  SecuritySettings:
    APIKeyRequired: true
    AuthorizationType: JWT
    CorsEnabled: true
    AllowedOrigins:
      - https://app.restaurantguard.com
      - https://dashboard.restaurantguard.com

  RequestValidation:
    ValidateRequestBody: true
    ValidateRequestParameters: true

  WAFRules:
    - RateLimiting
    - IPBlacklist
    - SQLInjectionProtection
    - XSSProtection
```

### 9.3 Compliance Requirements

#### 9.3.1 GDPR Compliance

**Data Subject Rights:**

- Right to access (data export functionality)
- Right to rectification (profile editing)
- Right to erasure (account deletion with 30-day grace period)
- Right to data portability (JSON export)
- Right to object (opt-out mechanisms)

**Implementation:**

```python
class GDPRComplianceService:
    async def export_user_data(self, user_id: str) -> dict:
        """Export all user data for GDPR compliance"""
        data = {
            'user_profile': await self.get_user_profile(user_id),
            'restaurants': await self.get_user_restaurants(user_id),
            'alerts': await self.get_user_alerts(user_id),
            'activity_log': await self.get_activity_log(user_id),
            'settings': await self.get_user_settings(user_id)
        }
        return data

    async def delete_user_data(self, user_id: str):
        """Permanently delete user data"""
        # Mark for deletion with 30-day grace period
        await self.mark_for_deletion(user_id)

        # Schedule permanent deletion
        await self.schedule_permanent_deletion(user_id, days=30)

        # Anonymize in analytics
        await self.anonymize_analytics_data(user_id)
```

#### 9.3.2 CCPA Compliance

**Consumer Rights:**

- Right to know (data collected disclosure)
- Right to delete (data deletion requests)
- Right to opt-out (data sale prohibition)
- Right to non-discrimination

**Do Not Sell:**
RestaurantGuard does not sell user data. Clear disclosure in privacy policy.

#### 9.3.3 SOC 2 Compliance

**Control Objectives:**

- Security: Access controls, encryption, monitoring
- Availability: 99.9% uptime, disaster recovery
- Processing Integrity: Data validation, error handling
- Confidentiality: Data classification, access restrictions
- Privacy: Notice, choice, collection limitation

**Audit Requirements:**

- Annual SOC 2 Type II audit
- Continuous monitoring and logging
- Quarterly internal security assessments
- Penetration testing (bi-annual)

### 9.4 Security Monitoring

#### 9.4.1 Intrusion Detection

**AWS GuardDuty Integration:**

- Continuous threat detection
- Unusual API activity monitoring
- Compromised credential detection
- Malicious IP monitoring

**CloudWatch Alarms:**

```python
SECURITY_ALARMS = {
    'failed_login_attempts': {
        'threshold': 5,
        'period': 300,  # 5 minutes
        'action': 'lock_account'
    },
    'unusual_api_activity': {
        'threshold': 1000,
        'period': 60,
        'action': 'alert_security_team'
    },
    'unauthorized_access_attempt': {
        'threshold': 1,
        'period': 60,
        'action': 'alert_immediately'
    }
}
```

#### 9.4.2 Audit Logging

**Logged Events:**

- User authentication (success/failure)
- Authorization decisions
- Data access (PII, sensitive data)
- Configuration changes
- API calls (all endpoints)
- Database queries (sensitive tables)

**Log Retention:**

- CloudWatch Logs: 90 days
- S3 Archive: 7 years (compliance requirement)
- Real-time SIEM integration

---

## 10. Development Timeline

### 10.1 MVP Development (30 Days)

#### Week 1: Foundation (Days 1-7)

**Days 1-2: Infrastructure Setup**

- [ ] AWS account configuration
- [ ] VPC and subnet setup
- [ ] RDS PostgreSQL deployment
- [ ] Redis ElastiCache deployment
- [ ] S3 buckets creation
- [ ] IAM roles and policies
- [ ] Secrets Manager setup

**Days 3-4: Database Implementation**

- [ ] Schema creation (all tables)
- [ ] Indexes and constraints
- [ ] Views creation
- [ ] Sample data seeding
- [ ] Migration scripts
- [ ] Backup configuration

**Days 5-6: Bedrock Nova Pro Configuration**

- [ ] Bedrock access enabled
- [ ] Knowledge base setup
- [ ] Action groups configuration
- [ ] Prompt templates created
- [ ] Testing AI responses
- [ ] Rate limit configuration

**Day 7: Core Lambda Functions**

- [ ] Lambda deployment framework
- [ ] Crisis detection Lambda skeleton
- [ ] Monitoring Lambda skeleton
- [ ] Response Lambda skeleton
- [ ] EventBridge schedules
- [ ] CloudWatch logging

#### Week 2: Core Agent Development (Days 8-14)

**Days 8-9: GMB API Integration**

- [ ] Authentication setup
- [ ] Rate limiter implementation
- [ ] Metrics collection functions
- [ ] Profile update functions
- [ ] Error handling
- [ ] Integration testing

**Days 10-11: Crisis Detection Algorithm**

- [ ] Threshold-based detection
- [ ] Anomaly detection logic
- [ ] Bedrock integration
- [ ] Severity scoring
- [ ] Confidence calculation
- [ ] Unit tests

**Days 12-13: Automated Response System**

- [ ] Response action framework
- [ ] GMB update automation
- [ ] Success verification
- [ ] Escalation logic
- [ ] Response logging
- [ ] Integration tests

**Day 14: Testing & Debugging**

- [ ] End-to-end testing
- [ ] Edge case handling
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Code review

#### Week 3: Frontend & Integration (Days 15-21)

**Days 15-16: React Dashboard Setup**

- [ ] Project initialization
- [ ] Component structure
- [ ] State management (Redux)
- [ ] Routing setup
- [ ] Authentication flow
- [ ] API client configuration

**Days 17-18: API Endpoints**

- [ ] API Gateway configuration
- [ ] Lambda integrations
- [ ] Request/response models
- [ ] Authentication middleware
- [ ] Rate limiting
- [ ] API documentation

**Days 19-20: Real-time Updates**

- [ ] WebSocket setup
- [ ] Real-time metrics streaming
- [ ] Alert notifications
- [ ] Dashboard updates
- [ ] Connection handling
- [ ] Error recovery

**Day 21: Alert System UI**

- [ ] Alert list component
- [ ] Alert detail view
- [ ] Action buttons
- [ ] Status management
- [ ] Filtering and sorting
- [ ] Responsive design

#### Week 4: Testing & Deployment (Days 22-30)

**Days 22-23: Integration Testing**

- [ ] API integration tests
- [ ] Frontend integration tests
- [ ] End-to-end workflows
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Performance testing

**Days 24-25: Performance Optimization**

- [ ] Database query optimization
- [ ] Lambda cold start reduction
- [ ] Frontend bundle optimization
- [ ] CDN configuration
- [ ] Caching strategy
- [ ] Load testing

**Days 26-27: Security Audit**

- [ ] Penetration testing
- [ ] Vulnerability scanning
- [ ] Authentication testing
- [ ] Authorization testing
- [ ] Data encryption verification
- [ ] Compliance checklist

**Day 28: Documentation**

- [ ] API documentation
- [ ] User guide
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] Architecture documentation
- [ ] Code comments

**Days 29-30: Production Deployment**

- [ ] Production environment setup
- [ ] Database migration
- [ ] DNS configuration
- [ ] SSL certificate setup
- [ ] Monitoring setup
- [ ] Launch checklist
- [ ] Post-launch monitoring

### 10.2 Critical Path Analysis

**Critical Path Items:**

1. **Bedrock Nova Pro Setup** (Day 6) - Blocks crisis analysis
2. **GMB API Access** (Day 8) - Blocks all monitoring
3. **Crisis Detection Logic** (Day 11) - Core functionality
4. **Database Schema** (Day 4) - Blocks all data operations
5. **API Gateway** (Day 17) - Blocks frontend integration

**Risk Mitigation:**

- Parallel development where possible
- Early API credential acquisition
- Fallback plans for each critical item
- Daily progress tracking
- Weekly milestone reviews

### 10.3 Resource Allocation

**Development Team (Recommended):**

- 1 Full-stack Engineer (Lead)
- 1 Backend Engineer
- 1 Frontend Engineer
- 1 DevOps Engineer (part-time)
- 1 QA Engineer (part-time)

**Time Allocation:**

- Backend development: 45%
- Frontend development: 25%
- Infrastructure: 15%
- Testing: 10%
- Documentation: 5%

---

## 11. Testing Strategy

### 11.1 Testing Levels

#### 11.1.1 Unit Testing

**Coverage Requirements:**

- Minimum 80% code coverage
- 100% coverage for critical paths
- All business logic tested
- Edge cases documented

**Testing Framework:**

```python
# pytest configuration
# conftest.py
import pytest
from unittest.mock import Mock, patch

@pytest.fixture
def mock_bedrock_client():
    """Mock Bedrock client for testing"""
    client = Mock()
    client.invoke_model.return_value = {
        'body': json.dumps({
            'crisis_detected': True,
            'severity': 8,
            'confidence': 92.5
        })
    }
    return client

@pytest.fixture
def sample_restaurant():
    """Sample restaurant data"""
    return {
        'id': 'test-123',
        'name': 'Test Restaurant',
        'gmb_place_id': 'ChIJtest123'
    }

# Test example
def test_crisis_detection(mock_bedrock_client, sample_restaurant):
    """Test crisis detection logic"""
    agent = CrisisDetectionAgent(bedrock_client=mock_bedrock_client)

    metrics = {
        'ranking_drop': 5,
        'traffic_loss': 0.35,
        'review_score_drop': 0.8
    }

    result = agent.detect_crisis(metrics)

    assert result == True
    assert mock_bedrock_client.invoke_model.called
```

#### 11.1.2 Integration Testing

**Test Scenarios:**

1. GMB API Integration

   - Authentication flow
   - Metric collection
   - Profile updates
   - Rate limit handling

2. Database Operations

   - CRUD operations
   - Transaction handling
   - Concurrent access
   - Data integrity

3. API Endpoints
   - Request validation
   - Response formatting
   - Error handling
   - Authentication

#### 11.1.3 End-to-End Testing

**User Workflows:**

```javascript
// Cypress E2E test example
describe("Crisis Detection Workflow", () => {
  it("should detect crisis and display alert", () => {
    // Login
    cy.visit("/login");
    cy.get('[data-testid="email"]').type("test@example.com");
    cy.get('[data-testid="password"]').type("password123");
    cy.get('[data-testid="login-button"]').click();

    // Navigate to dashboard
    cy.url().should("include", "/dashboard");
    cy.get('[data-testid="restaurant-selector"]').select("Test Restaurant");

    // Trigger crisis (via test API)
    cy.request("POST", "/api/test/trigger-crisis", {
      restaurant_id: "test-123",
      crisis_type: "ranking_drop",
    });

    // Verify alert appears
    cy.get('[data-testid="alert-banner"]', { timeout: 30000 })
      .should("be.visible")
      .and("contain", "Ranking Drop Detected");

    // Verify automated response
    cy.get('[data-testid="automated-actions"]').should(
      "contain",
      "GMB profile updated"
    );
  });
});
```

### 11.2 Performance Testing

#### 11.2.1 Load Testing Scenarios

**Scenario 1: Normal Load**

- 50 concurrent restaurants
- 15-minute monitoring intervals
- Expected: <2s response time, 0% errors

**Scenario 2: Peak Load**

- 100 concurrent restaurants
- Crisis events for 20% of restaurants
- Expected: <3s response time, <1% errors

**Scenario 3: Stress Test**

- 200 concurrent restaurants
- 50% crisis rate
- Goal: Identify breaking point

**Testing Tools:**

- Apache JMeter for API load testing
- Artillery for WebSocket testing
- AWS CloudWatch for monitoring

#### 11.2.2 Performance Benchmarks

| Metric                   | Target | Acceptable | Poor   |
| ------------------------ | ------ | ---------- | ------ |
| API Response Time (p95)  | <2s    | <3s        | >3s    |
| Dashboard Load Time      | <2s    | <3s        | >3s    |
| Crisis Detection Latency | <15min | <30min     | >30min |
| Database Query Time      | <100ms | <500ms     | >500ms |
| Lambda Cold Start        | <1s    | <2s        | >2s    |

### 11.3 Security Testing

#### 11.3.1 Vulnerability Scanning

**Tools:**

- OWASP ZAP for web application scanning
- Snyk for dependency vulnerability scanning
- AWS Inspector for infrastructure scanning
- Trivy for container scanning

**Scan Schedule:**

- Weekly automated scans
- Pre-deployment mandatory scan
- Monthly manual penetration testing

#### 11.3.2 Authentication Testing

**Test Cases:**

- [ ] SQL injection attempts
- [ ] XSS attack vectors
- [ ] CSRF protection
- [ ] JWT token manipulation
- [ ] Session hijacking
- [ ] Brute force attacks
- [ ] Password strength validation

---

## 12. Deployment and Operations

### 12.1 Infrastructure as Code

#### 12.1.1 Terraform Configuration

```hcl
# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "restaurantguard-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "RestaurantGuard"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Configuration
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr = "10.0.0.0/16"
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24", "10.0.12.0/24"]
}

# RDS PostgreSQL
resource "aws_rds_cluster" "main" {
  cluster_identifier      = "restaurantguard-${var.environment}"
  engine                  = "aurora-postgresql"
  engine_version          = "15.2"
  database_name           = "restaurantguard"
  master_username         = var.db_username
  master_password         = var.db_password

  vpc_security_group_ids  = [aws_security_group.rds.id]
  db_subnet_group_name    = aws_db_subnet_group.main.name

  backup_retention_period = 30
  preferred_backup_window = "03:00-04:00"

  enabled_cloudwatch_logs_exports = ["postgresql"]
  storage_encrypted = true

  tags = {
    Name = "restaurantguard-db-${var.environment}"
  }
}

# Lambda Functions
resource "aws_lambda_function" "crisis_detection" {
  function_name = "restaurantguard-crisis-detection-${var.environment}"
  role          = aws_iam_role.lambda_execution.arn

  runtime = "python3.11"
  handler = "main.lambda_handler"

  filename         = "lambda_packages/crisis_detection.zip"
  source_code_hash = filebase64sha256("lambda_packages/crisis_detection.zip")

  memory_size = 512
  timeout     = 300

  environment {
    variables = {
      BEDROCK_MODEL_ID = "anthropic.claude-3-nova-pro"
      DB_ARN           = aws_rds_cluster.main.arn
      DB_SECRET_ARN    = aws_secretsmanager_secret.db_credentials.arn
      DB_NAME          = aws_rds_cluster.main.database_name
      ENVIRONMENT      = var.environment
    }
  }

  vpc_config {
    subnet_ids         = module.vpc.private_subnet_ids
    security_group_ids = [aws_security_group.lambda.id]
  }
}

# EventBridge Schedule
resource "aws_cloudwatch_event_rule" "monitoring_schedule" {
  name                = "restaurant-monitoring-${var.environment}"
  schedule_expression = "rate(15 minutes)"
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.monitoring_schedule.name
  target_id = "CrisisDetectionLambda"
  arn       = aws_lambda_function.crisis_detection.arn
}
```

### 12.2 CI/CD Pipeline

#### 12.2.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy RestaurantGuard

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-east-1
  PYTHON_VERSION: "3.11"
  NODE_VERSION: "18"

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run unit tests
        run: pytest tests/ --cov=src --cov-report=xml

      - name: Run linting
        run: |
          flake8 src/
          black --check src/

      - name: Security scan
        run: bandit -r src/

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Lambda packages
        run: |
          chmod +x scripts/build-lambda-packages.sh
          ./scripts/build-lambda-packages.sh

      - name: Build frontend
        run: |
          cd frontend
          npm install
          npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            lambda_packages/
            frontend/build/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Deploy with Terraform
        run: |
          cd terraform
          terraform init
          terraform plan -out=tfplan
          terraform apply tfplan

      - name: Deploy frontend to S3
        run: |
          aws s3 sync frontend/build/ s3://restaurantguard-frontend-prod/ --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DIST_ID }} --paths "/*"

      - name: Run smoke tests
        run: |
          chmod +x scripts/smoke-tests.sh
          ./scripts/smoke-tests.sh
```

### 12.3 Monitoring and Alerting

#### 12.3.1 CloudWatch Dashboards

**Main Dashboard Metrics:**

- Lambda invocations and errors
- API Gateway request count and latency
- RDS CPU, memory, connections
- Crisis detection rate
- Alert generation rate
- System health score

#### 12.3.2 Alert Configuration

```python
CLOUDWATCH_ALARMS = {
    'high_error_rate': {
        'metric': 'Errors',
        'threshold': 10,
        'period': 300,
        'evaluation_periods': 2,
        'statistic': 'Sum',
        'comparison': 'GreaterThanThreshold',
        'actions': ['sns:team-alerts']
    },
    'high_latency': {
        'metric': 'Duration',
        'threshold': 5000,  # ms
        'period': 300,
        'evaluation_periods': 3,
        'statistic': 'Average',
        'comparison': 'GreaterThanThreshold',
        'actions': ['sns:team-alerts']
    },
    'db_cpu_high': {
        'metric': 'CPUUtilization',
        'threshold': 80,
        'period': 300,
        'evaluation_periods': 2,
        'statistic': 'Average',
        'comparison': 'GreaterThanThreshold',
        'actions': ['sns:infrastructure-alerts', 'sns:pagerduty']
    }
}
```

### 12.4 Operational Procedures

#### 12.4.1 Deployment Checklist

**Pre-Deployment:**

- [ ] All tests passing
- [ ] Code review approved
- [ ] Security scan passed
- [ ] Database migrations tested
- [ ] Rollback plan documented
- [ ] Stakeholders notified

**During Deployment:**

- [ ] Monitor error rates
- [ ] Verify health checks
- [ ] Test critical workflows
- [ ] Check performance metrics
- [ ] Validate integrations

**Post-Deployment:**

- [ ] Smoke tests passed
- [ ] User acceptance testing
- [ ] Documentation updated
- [ ] Deployment notes logged
- [ ] Team debriefing

#### 12.4.2 Incident Response

**Severity Levels:**

**P0 - Critical (Response: Immediate)**

- Complete system outage
- Data breach or security incident
- Critical functionality broken for all users

**P1 - High (Response: <1 hour)**

- Major feature unavailable
- Performance severely degraded
- Affects >25% of users

**P2 - Medium (Response: <4 hours)**

- Minor feature broken
- Intermittent issues
- Affects <25% of users

**P3 - Low (Response: <24 hours)**

- Cosmetic issues
- Enhancement requests
- Minimal user impact

**Incident Response Procedure:**

1. Detect and acknowledge
2. Assess severity
3. Assemble response team
4. Investigate root cause
5. Implement fix or rollback
6. Verify resolution
7. Post-mortem documentation

---

## 13. Risk Management

### 13.1 Technical Risks

| Risk                             | Probability | Impact | Mitigation Strategy                                       |
| -------------------------------- | ----------- | ------ | --------------------------------------------------------- |
| API rate limits exceeded         | Medium      | High   | Implement request queuing, caching, multi-source fallback |
| Bedrock latency issues           | Low         | Medium | Async processing, fallback to rule-based detection        |
| Database performance degradation | Medium      | High   | Read replicas, query optimization, caching layer          |
| GMB API breaking changes         | Low         | High   | Version monitoring, adapter pattern, gradual migration    |
| False positive alerts            | High        | Medium | Confidence thresholds, user feedback loops, ML refinement |

### 13.2 Business Risks

| Risk                                    | Probability | Impact | Mitigation Strategy                                          |
| --------------------------------------- | ----------- | ------ | ------------------------------------------------------------ |
| Low adoption rate                       | Medium      | High   | Free trial, case studies, targeted marketing                 |
| Competitor launches similar product     | Medium      | High   | First-mover advantage, patents, continuous innovation        |
| High customer churn                     | Low         | High   | Exceptional support, value demonstration, engagement metrics |
| Pricing resistance                      | Medium      | Medium | Flexible tiers, ROI calculator, pilot programs               |
| Regulatory changes (GDPR, data privacy) | Low         | Medium | Legal counsel, compliance monitoring, adaptable architecture |

### 13.3 Operational Risks

| Risk                                    | Probability | Impact   | Mitigation Strategy                                          |
| --------------------------------------- | ----------- | -------- | ------------------------------------------------------------ |
| Key team member departure               | Medium      | Medium   | Documentation, knowledge sharing, cross-training             |
| Infrastructure costs exceed projections | Medium      | High     | Cost monitoring, optimization, scalable architecture         |
| Third-party service outage              | Low         | High     | Redundancy, fallback mechanisms, SLA monitoring              |
| Security breach                         | Low         | Critical | Security audits, penetration testing, incident response plan |
| Data loss                               | Very Low    | Critical | Automated backups, replication, disaster recovery            |

---

## 14. Future Enhancements

### 14.1 Phase 2 Features (Months 2-3)

#### 14.1.1 Predictive Market Adaptation Module

**Features:**

- Consumer trend forecasting (30-60 day predictions)
- Menu optimization recommendations
- Seasonal pattern analysis
- Dynamic content adaptation

**Technical Requirements:**

- Time-series analysis algorithms
- Additional data sources (social media, local events)
- Expanded Bedrock usage for predictions
- New database tables for trend data

#### 14.1.2 Advanced Competitive Intelligence

**Features:**

- Automated competitor tracking (5-10 competitors)
- Market share analysis
- Pricing strategy recommendations
- Competitive positioning insights

**Technical Requirements:**

- Competitor data collection pipeline
- Comparative analysis algorithms
- Visualization components
- Scheduled reporting system

### 14.2 Phase 3 Features (Months 4-6)

#### 14.2.1 Multi-Location Management

**Features:**

- Centralized dashboard for chains
- Location-specific optimization
- Franchise performance comparison
- Bulk action capabilities

**Technical Requirements:**

- Hierarchical data model
- Role-based access for chains
- Aggregation queries
- Location grouping logic

#### 14.2.2 Advanced Learning System

**Features:**

- Cross-restaurant intelligence network
- Industry-wide threat detection
- Success pattern recognition
- Predictive crisis prevention

**Technical Requirements:**

- Federated learning architecture
- Pattern recognition algorithms
- Anonymized data sharing
- Knowledge base expansion

### 14.3 Long-term Vision (Year 1+)

#### 14.3.1 Complete Automation Suite

- Website content updates
- Social media management
- Review response automation
- Dynamic pricing recommendations

#### 14.3.2 Enterprise Features

- White-label solution for agencies
- API marketplace for integrations
- Custom reporting engine
- Dedicated account management

#### 14.3.3 Platform Expansion

- Mobile native apps (iOS/Android)
- Browser extension for quick access
- Slack/Teams integrations
- Restaurant POS integrations
