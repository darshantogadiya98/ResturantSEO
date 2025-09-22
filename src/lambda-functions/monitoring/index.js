const AWS = require('aws-sdk');
const axios = require('axios');
const { google } = require('googleapis');

class MonitoringService {
    constructor() {
        this.rds = new AWS.RDSDataService({
            region: process.env.AWS_REGION || 'us-east-1'
        });
        this.s3 = new AWS.S3();
        this.bedrock = new AWS.BedrockRuntime();
        this.secrets = new AWS.SecretsManager();

        this.rdsClusterArn = process.env.RDS_CLUSTER_ARN;
        this.rdsSecretArn = process.env.RDS_SECRET_ARN;
        this.rdsDatabase = process.env.RDS_DATABASE;
        this.s3Bucket = process.env.S3_BUCKET;
        this.bedrockAgentId = process.env.BEDROCK_AGENT_ID;
        this.secretsArn = process.env.SECRETS_ARN;
    }

    async handler(event, context) {
        console.log('Monitoring service started', { event, context: context.awsRequestId });

        try {
            const restaurants = await this.getActiveRestaurants();
            console.log(`Processing ${restaurants.length} restaurants`);

            const results = await Promise.allSettled(
                restaurants.map(restaurant => this.processRestaurant(restaurant))
            );

            const successfulResults = results.filter(r => r.status === 'fulfilled').map(r => r.value);
            const failedResults = results.filter(r => r.status === 'rejected');

            if (failedResults.length > 0) {
                console.error('Some restaurants failed processing:', failedResults.map(r => r.reason));
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    processed: successfulResults.length,
                    failed: failedResults.length,
                    results: successfulResults
                })
            };
        } catch (error) {
            console.error('Monitoring service error:', error);
            throw error;
        }
    }

    async getActiveRestaurants() {
        const query = `
            SELECT id, name, website, digital_presence, target_keywords, monitoring_config, api_credentials
            FROM restaurants
            WHERE status = 'active'
            ORDER BY updated_at DESC
        `;

        try {
            const result = await this.rds.executeStatement({
                resourceArn: this.rdsClusterArn,
                secretArn: this.rdsSecretArn,
                database: this.rdsDatabase,
                sql: query
            }).promise();

            return this.formatRdsResults(result.records);
        } catch (error) {
            console.error('Error fetching active restaurants:', error);
            throw error;
        }
    }

    async processRestaurant(restaurant) {
        const startTime = Date.now();
        console.log(`Processing restaurant: ${restaurant.name} (${restaurant.id})`);

        try {
            // Collect current metrics
            const metrics = await this.collectMetrics(restaurant);

            // Store metrics in database and S3
            await Promise.all([
                this.storeMetrics(restaurant.id, metrics),
                this.storeMetricsToS3(restaurant.id, metrics)
            ]);

            // Check for crisis conditions
            const crisisCheck = await this.checkForCrisis(restaurant, metrics);

            if (crisisCheck.hasCrisis) {
                console.log(`Crisis detected for ${restaurant.name}:`, crisisCheck);
                await this.triggerCrisisResponse(restaurant, crisisCheck);
            }

            const processingTime = Date.now() - startTime;

            return {
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                metricsCollected: Object.keys(metrics),
                crisisDetected: crisisCheck.hasCrisis,
                crisisType: crisisCheck.crisisType,
                processingTimeMs: processingTime
            };
        } catch (error) {
            console.error(`Error processing restaurant ${restaurant.name}:`, error);
            throw error;
        }
    }

    async collectMetrics(restaurant) {
        const metrics = {
            timestamp: new Date().toISOString(),
            restaurantId: restaurant.id
        };

        try {
            // Get API credentials
            const apiCredentials = await this.getApiCredentials();

            // Collect metrics in parallel
            const metricCollectors = [];

            if (restaurant.digital_presence?.googleMyBusinessId) {
                metricCollectors.push(
                    this.getGoogleMyBusinessMetrics(restaurant, apiCredentials.google_my_business)
                        .then(data => { metrics.googleMyBusiness = data; })
                        .catch(err => { console.error('GMB metrics error:', err); metrics.googleMyBusiness = null; })
                );
            }

            if (restaurant.website) {
                metricCollectors.push(
                    this.getSearchConsoleMetrics(restaurant, apiCredentials.google_search_console)
                        .then(data => { metrics.searchConsole = data; })
                        .catch(err => { console.error('Search Console metrics error:', err); metrics.searchConsole = null; }),

                    this.getTechnicalMetrics(restaurant.website)
                        .then(data => { metrics.technical = data; })
                        .catch(err => { console.error('Technical metrics error:', err); metrics.technical = null; })
                );
            }

            if (restaurant.digital_presence) {
                metricCollectors.push(
                    this.getReviewMetrics(restaurant, apiCredentials)
                        .then(data => { metrics.reviews = data; })
                        .catch(err => { console.error('Review metrics error:', err); metrics.reviews = null; })
                );
            }

            await Promise.allSettled(metricCollectors);

            return metrics;
        } catch (error) {
            console.error('Error collecting metrics:', error);
            throw error;
        }
    }

    async getApiCredentials() {
        try {
            const result = await this.secrets.getSecretValue({
                SecretId: this.secretsArn
            }).promise();

            return JSON.parse(result.SecretString);
        } catch (error) {
            console.error('Error getting API credentials:', error);
            throw error;
        }
    }

    async getSearchConsoleMetrics(restaurant, credentials) {
        if (!credentials || !restaurant.website) {
            return null;
        }

        try {
            const auth = new google.auth.GoogleAuth({
                credentials: JSON.parse(credentials),
                scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
            });

            const searchConsole = google.webmasters({ version: 'v3', auth });

            const endDate = new Date();
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 7);

            const response = await searchConsole.searchanalytics.query({
                siteUrl: restaurant.website,
                requestBody: {
                    startDate: this.formatDate(startDate),
                    endDate: this.formatDate(endDate),
                    dimensions: ['query', 'page'],
                    rowLimit: 1000
                }
            });

            return {
                totalClicks: response.data.rows?.reduce((sum, row) => sum + (row.clicks || 0), 0) || 0,
                totalImpressions: response.data.rows?.reduce((sum, row) => sum + (row.impressions || 0), 0) || 0,
                averagePosition: this.calculateAveragePosition(response.data.rows),
                keywordData: response.data.rows?.slice(0, 50) || []
            };
        } catch (error) {
            console.error('Search Console API error:', error);
            return null;
        }
    }

    async getGoogleMyBusinessMetrics(restaurant, credentials) {
        if (!credentials || !restaurant.digital_presence?.googleMyBusinessId) {
            return null;
        }

        try {
            // Note: GMB API has been deprecated, using Google Business Profile API
            // This is a placeholder for the new API implementation
            return {
                views: 0,
                searches: 0,
                actions: 0,
                photos: 0,
                reviews: {
                    count: 0,
                    averageRating: 0,
                    recent: []
                }
            };
        } catch (error) {
            console.error('Google My Business API error:', error);
            return null;
        }
    }

    async getTechnicalMetrics(website) {
        try {
            const startTime = Date.now();

            // Basic website availability and speed check
            const response = await axios.get(website, {
                timeout: 10000,
                validateStatus: () => true // Don't throw on HTTP errors
            });

            const loadTime = Date.now() - startTime;

            return {
                isAccessible: response.status === 200,
                statusCode: response.status,
                loadTimeMs: loadTime,
                hasHttps: website.startsWith('https://'),
                contentLength: response.headers['content-length'] || 0,
                server: response.headers['server'] || 'unknown',
                lastChecked: new Date().toISOString()
            };
        } catch (error) {
            console.error('Technical metrics error:', error);
            return {
                isAccessible: false,
                error: error.message,
                lastChecked: new Date().toISOString()
            };
        }
    }

    async getReviewMetrics(restaurant, apiCredentials) {
        const reviewData = {
            platforms: {},
            summary: {
                totalReviews: 0,
                averageRating: 0,
                recentNegativeCount: 0
            }
        };

        try {
            // Yelp reviews
            if (restaurant.digital_presence?.yelpBusinessId && apiCredentials.yelp_fusion) {
                const yelpData = await this.getYelpReviews(restaurant.digital_presence.yelpBusinessId, apiCredentials.yelp_fusion);
                if (yelpData) {
                    reviewData.platforms.yelp = yelpData;
                }
            }

            // TripAdvisor reviews (if API access available)
            if (restaurant.digital_presence?.tripadvisorId && apiCredentials.tripadvisor) {
                const tripAdvisorData = await this.getTripAdvisorReviews(restaurant.digital_presence.tripadvisorId, apiCredentials.tripadvisor);
                if (tripAdvisorData) {
                    reviewData.platforms.tripadvisor = tripAdvisorData;
                }
            }

            // Calculate summary
            this.calculateReviewSummary(reviewData);

            return reviewData;
        } catch (error) {
            console.error('Review metrics error:', error);
            return reviewData;
        }
    }

    async getYelpReviews(businessId, apiKey) {
        try {
            const response = await axios.get(`https://api.yelp.com/v3/businesses/${businessId}/reviews`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            return {
                rating: response.data.rating,
                reviewCount: response.data.review_count,
                reviews: response.data.reviews.map(review => ({
                    id: review.id,
                    rating: review.rating,
                    text: review.text,
                    timeCreated: review.time_created,
                    user: review.user.name
                }))
            };
        } catch (error) {
            console.error('Yelp API error:', error);
            return null;
        }
    }

    async getTripAdvisorReviews(locationId, apiKey) {
        // TripAdvisor API implementation would go here
        // This is a placeholder as TripAdvisor API access is limited
        return null;
    }

    async storeMetrics(restaurantId, metrics) {
        const query = `
            INSERT INTO seo_metrics (restaurant_id, metric_type, metric_data, recorded_at)
            VALUES (?, 'monitoring_snapshot', ?, ?)
        `;

        try {
            await this.rds.executeStatement({
                resourceArn: this.rdsClusterArn,
                secretArn: this.rdsSecretArn,
                database: this.rdsDatabase,
                sql: query,
                parameters: [
                    { name: 'restaurant_id', value: { stringValue: restaurantId } },
                    { name: 'metric_data', value: { stringValue: JSON.stringify(metrics) } },
                    { name: 'recorded_at', value: { stringValue: new Date().toISOString() } }
                ]
            }).promise();
        } catch (error) {
            console.error('Error storing metrics to RDS:', error);
            throw error;
        }
    }

    async storeMetricsToS3(restaurantId, metrics) {
        const key = `restaurants/${restaurantId}/metrics/${new Date().toISOString().split('T')[0]}/${Date.now()}.json`;

        try {
            await this.s3.putObject({
                Bucket: this.s3Bucket,
                Key: key,
                Body: JSON.stringify(metrics, null, 2),
                ContentType: 'application/json'
            }).promise();
        } catch (error) {
            console.error('Error storing metrics to S3:', error);
            // Don't throw here as S3 storage is not critical
        }
    }

    async checkForCrisis(restaurant, currentMetrics) {
        try {
            // Get historical baseline
            const baseline = await this.getBaselineMetrics(restaurant.id);

            if (!baseline) {
                console.log(`No baseline data for restaurant ${restaurant.id}, skipping crisis detection`);
                return { hasCrisis: false };
            }

            // Invoke Bedrock agent for crisis analysis
            const analysis = await this.bedrock.invokeAgent({
                agentId: this.bedrockAgentId,
                agentAliasId: 'TSTALIASID', // Default test alias
                sessionId: `crisis-check-${restaurant.id}-${Date.now()}`,
                inputText: JSON.stringify({
                    restaurant: restaurant,
                    currentMetrics: currentMetrics,
                    baseline: baseline,
                    task: 'analyze_for_crisis'
                })
            }).promise();

            const result = JSON.parse(analysis.completion);
            return result;
        } catch (error) {
            console.error('Crisis detection error:', error);
            // Fallback to simple threshold-based detection
            return this.fallbackCrisisDetection(currentMetrics, baseline);
        }
    }

    async getBaselineMetrics(restaurantId) {
        const query = `
            SELECT metric_data
            FROM seo_metrics
            WHERE restaurant_id = ?
              AND metric_type = 'monitoring_snapshot'
              AND recorded_at >= ?
            ORDER BY recorded_at DESC
            LIMIT 30
        `;

        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const result = await this.rds.executeStatement({
                resourceArn: this.rdsClusterArn,
                secretArn: this.rdsSecretArn,
                database: this.rdsDatabase,
                sql: query,
                parameters: [
                    { name: 'restaurant_id', value: { stringValue: restaurantId } },
                    { name: 'recorded_at', value: { stringValue: thirtyDaysAgo.toISOString() } }
                ]
            }).promise();

            if (result.records.length === 0) {
                return null;
            }

            const historicalData = result.records.map(record =>
                JSON.parse(record[0].stringValue)
            );

            return this.calculateBaseline(historicalData);
        } catch (error) {
            console.error('Error getting baseline metrics:', error);
            return null;
        }
    }

    fallbackCrisisDetection(currentMetrics, baseline) {
        // Simple threshold-based crisis detection
        if (!baseline) return { hasCrisis: false };

        const issues = [];

        // Check technical issues
        if (currentMetrics.technical && !currentMetrics.technical.isAccessible) {
            issues.push({
                type: 'website_down',
                severity: 'critical',
                description: 'Website is not accessible'
            });
        }

        // Check load time
        if (currentMetrics.technical?.loadTimeMs > 5000) {
            issues.push({
                type: 'slow_loading',
                severity: 'medium',
                description: `Website load time is ${currentMetrics.technical.loadTimeMs}ms`
            });
        }

        return {
            hasCrisis: issues.length > 0,
            crisisType: issues[0]?.type,
            severity: issues[0]?.severity,
            issues: issues
        };
    }

    async triggerCrisisResponse(restaurant, crisisData) {
        console.log(`Triggering crisis response for ${restaurant.name}`);

        try {
            // Invoke crisis response Lambda
            const lambda = new AWS.Lambda();

            const payload = {
                restaurantId: restaurant.id,
                crisisType: crisisData.crisisType,
                severity: crisisData.severity,
                affectedMetrics: crisisData.issues,
                restaurant: restaurant
            };

            await lambda.invoke({
                FunctionName: 'restaurantguard-crisis-response',
                InvocationType: 'Event', // Asynchronous invocation
                Payload: JSON.stringify(payload)
            }).promise();

            console.log(`Crisis response triggered for ${restaurant.name}`);
        } catch (error) {
            console.error('Error triggering crisis response:', error);
            throw error;
        }
    }

    // Helper methods
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    calculateAveragePosition(rows) {
        if (!rows || rows.length === 0) return 0;

        const totalImpressions = rows.reduce((sum, row) => sum + (row.impressions || 0), 0);
        const weightedPositions = rows.reduce((sum, row) =>
            sum + ((row.position || 0) * (row.impressions || 0)), 0
        );

        return totalImpressions > 0 ? weightedPositions / totalImpressions : 0;
    }

    calculateReviewSummary(reviewData) {
        let totalReviews = 0;
        let totalRating = 0;
        let recentNegativeCount = 0;

        Object.values(reviewData.platforms).forEach(platform => {
            if (platform) {
                totalReviews += platform.reviewCount || 0;
                totalRating += (platform.rating || 0) * (platform.reviewCount || 0);

                // Count recent negative reviews (rating < 3)
                if (platform.reviews) {
                    const recentDate = new Date();
                    recentDate.setDate(recentDate.getDate() - 7);

                    recentNegativeCount += platform.reviews.filter(review =>
                        review.rating < 3 && new Date(review.timeCreated) > recentDate
                    ).length;
                }
            }
        });

        reviewData.summary = {
            totalReviews,
            averageRating: totalReviews > 0 ? totalRating / totalReviews : 0,
            recentNegativeCount
        };
    }

    calculateBaseline(historicalData) {
        // Calculate averages from historical data
        const baseline = {
            searchConsole: {
                averageClicks: 0,
                averageImpressions: 0,
                averagePosition: 0
            },
            technical: {
                averageLoadTime: 0,
                uptimePercentage: 0
            },
            reviews: {
                averageRating: 0,
                typicalReviewVolume: 0
            }
        };

        if (historicalData.length === 0) return baseline;

        // Calculate Search Console baseline
        const searchConsoleData = historicalData
            .map(d => d.searchConsole)
            .filter(d => d);

        if (searchConsoleData.length > 0) {
            baseline.searchConsole.averageClicks =
                searchConsoleData.reduce((sum, d) => sum + (d.totalClicks || 0), 0) / searchConsoleData.length;
            baseline.searchConsole.averageImpressions =
                searchConsoleData.reduce((sum, d) => sum + (d.totalImpressions || 0), 0) / searchConsoleData.length;
            baseline.searchConsole.averagePosition =
                searchConsoleData.reduce((sum, d) => sum + (d.averagePosition || 0), 0) / searchConsoleData.length;
        }

        // Calculate technical baseline
        const technicalData = historicalData
            .map(d => d.technical)
            .filter(d => d);

        if (technicalData.length > 0) {
            baseline.technical.averageLoadTime =
                technicalData.reduce((sum, d) => sum + (d.loadTimeMs || 0), 0) / technicalData.length;
            baseline.technical.uptimePercentage =
                technicalData.filter(d => d.isAccessible).length / technicalData.length * 100;
        }

        return baseline;
    }

    formatRdsResults(records) {
        return records.map(record => ({
            id: record[0].stringValue,
            name: record[1].stringValue,
            website: record[2].stringValue,
            digital_presence: JSON.parse(record[3].stringValue || '{}'),
            target_keywords: JSON.parse(record[4].stringValue || '[]'),
            monitoring_config: JSON.parse(record[5].stringValue || '{}'),
            api_credentials: JSON.parse(record[6].stringValue || '{}')
        }));
    }
}

// Lambda handler
exports.handler = async (event, context) => {
    const monitoringService = new MonitoringService();
    return await monitoringService.handler(event, context);
};