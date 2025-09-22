const { MonitoringService } = require('../../src/lambda-functions/monitoring/index');
const AWS = require('aws-sdk');

// Mock AWS services
jest.mock('aws-sdk');

describe('MonitoringService', () => {
    let monitoringService;
    let mockRDS;
    let mockS3;
    let mockBedrock;
    let mockSecrets;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock AWS service constructors
        mockRDS = {
            executeStatement: jest.fn(),
        };
        mockS3 = {
            putObject: jest.fn(),
        };
        mockBedrock = {
            invokeAgent: jest.fn(),
        };
        mockSecrets = {
            getSecretValue: jest.fn(),
        };

        AWS.RDSDataService.mockImplementation(() => mockRDS);
        AWS.S3.mockImplementation(() => mockS3);
        AWS.BedrockRuntime.mockImplementation(() => mockBedrock);
        AWS.SecretsManager.mockImplementation(() => mockSecrets);

        // Set environment variables
        process.env.RDS_CLUSTER_ARN = 'test-cluster-arn';
        process.env.RDS_SECRET_ARN = 'test-secret-arn';
        process.env.RDS_DATABASE = 'test-db';
        process.env.S3_BUCKET = 'test-bucket';
        process.env.BEDROCK_AGENT_ID = 'test-agent-id';
        process.env.SECRETS_ARN = 'test-secrets-arn';

        monitoringService = new MonitoringService();
    });

    describe('handler', () => {
        it('should process restaurants successfully', async () => {
            // Mock getActiveRestaurants
            const mockRestaurants = [
                {
                    id: 'restaurant-1',
                    name: 'Test Restaurant',
                    website: 'https://test-restaurant.com',
                    digital_presence: {},
                    target_keywords: [],
                    monitoring_config: {}
                }
            ];

            mockRDS.executeStatement.mockResolvedValue({
                records: [
                    [
                        { stringValue: 'restaurant-1' },
                        { stringValue: 'Test Restaurant' },
                        { stringValue: 'https://test-restaurant.com' },
                        { stringValue: '{}' },
                        { stringValue: '[]' },
                        { stringValue: '{}' },
                        { stringValue: '{}' }
                    ]
                ]
            });

            // Mock API credentials
            mockSecrets.getSecretValue.mockResolvedValue({
                SecretString: JSON.stringify({
                    google_search_console: 'test-gsc-key',
                    google_my_business: 'test-gmb-key'
                })
            });

            // Mock S3 putObject
            mockS3.putObject.mockReturnValue({
                promise: jest.fn().mockResolvedValue({})
            });

            // Mock Bedrock agent response
            mockBedrock.invokeAgent.mockReturnValue({
                promise: jest.fn().mockResolvedValue({
                    completion: JSON.stringify({ hasCrisis: false })
                })
            });

            const event = {};
            const context = { awsRequestId: 'test-request-id' };

            const result = await monitoringService.handler(event, context);

            expect(result.statusCode).toBe(200);
            const body = JSON.parse(result.body);
            expect(body.processed).toBe(1);
            expect(body.failed).toBe(0);
        });

        it('should handle errors gracefully', async () => {
            // Mock database error
            mockRDS.executeStatement.mockRejectedValue(new Error('Database error'));

            const event = {};
            const context = { awsRequestId: 'test-request-id' };

            await expect(monitoringService.handler(event, context)).rejects.toThrow('Database error');
        });
    });

    describe('getActiveRestaurants', () => {
        it('should fetch active restaurants from database', async () => {
            const mockResponse = {
                records: [
                    [
                        { stringValue: 'restaurant-1' },
                        { stringValue: 'Test Restaurant' },
                        { stringValue: 'https://test-restaurant.com' },
                        { stringValue: '{}' },
                        { stringValue: '[]' },
                        { stringValue: '{}' },
                        { stringValue: '{}' }
                    ]
                ]
            };

            mockRDS.executeStatement.mockResolvedValue(mockResponse);

            const restaurants = await monitoringService.getActiveRestaurants();

            expect(restaurants).toHaveLength(1);
            expect(restaurants[0].id).toBe('restaurant-1');
            expect(restaurants[0].name).toBe('Test Restaurant');
            expect(mockRDS.executeStatement).toHaveBeenCalledWith({
                resourceArn: 'test-cluster-arn',
                secretArn: 'test-secret-arn',
                database: 'test-db',
                sql: expect.stringContaining('SELECT id, name, website')
            });
        });

        it('should handle empty results', async () => {
            mockRDS.executeStatement.mockResolvedValue({ records: [] });

            const restaurants = await monitoringService.getActiveRestaurants();

            expect(restaurants).toHaveLength(0);
        });
    });

    describe('collectMetrics', () => {
        const mockRestaurant = {
            id: 'restaurant-1',
            name: 'Test Restaurant',
            website: 'https://test-restaurant.com',
            digital_presence: {
                googleMyBusinessId: 'gmb-id',
                yelpBusinessId: 'yelp-id'
            }
        };

        beforeEach(() => {
            mockSecrets.getSecretValue.mockResolvedValue({
                SecretString: JSON.stringify({
                    google_search_console: 'test-gsc-key',
                    google_my_business: 'test-gmb-key',
                    yelp_fusion: 'test-yelp-key'
                })
            });
        });

        it('should collect metrics for restaurant', async () => {
            const metrics = await monitoringService.collectMetrics(mockRestaurant);

            expect(metrics).toHaveProperty('timestamp');
            expect(metrics).toHaveProperty('restaurantId', 'restaurant-1');
            expect(mockSecrets.getSecretValue).toHaveBeenCalled();
        });

        it('should handle API credential errors', async () => {
            mockSecrets.getSecretValue.mockRejectedValue(new Error('Secrets error'));

            await expect(monitoringService.collectMetrics(mockRestaurant)).rejects.toThrow('Secrets error');
        });
    });

    describe('getTechnicalMetrics', () => {
        // Mock axios for testing
        const axios = require('axios');
        jest.mock('axios');

        it('should return technical metrics for accessible website', async () => {
            const mockResponse = {
                status: 200,
                headers: {
                    'content-length': '1024',
                    'server': 'nginx'
                }
            };

            axios.get = jest.fn().mockResolvedValue(mockResponse);

            const metrics = await monitoringService.getTechnicalMetrics('https://test-restaurant.com');

            expect(metrics.isAccessible).toBe(true);
            expect(metrics.statusCode).toBe(200);
            expect(metrics).toHaveProperty('loadTimeMs');
            expect(metrics.hasHttps).toBe(true);
        });

        it('should handle website errors', async () => {
            axios.get = jest.fn().mockRejectedValue(new Error('Network error'));

            const metrics = await monitoringService.getTechnicalMetrics('https://test-restaurant.com');

            expect(metrics.isAccessible).toBe(false);
            expect(metrics).toHaveProperty('error', 'Network error');
        });
    });

    describe('storeMetrics', () => {
        it('should store metrics in RDS', async () => {
            mockRDS.executeStatement.mockResolvedValue({});

            const metrics = { test: 'data' };
            await monitoringService.storeMetrics('restaurant-1', metrics);

            expect(mockRDS.executeStatement).toHaveBeenCalledWith({
                resourceArn: 'test-cluster-arn',
                secretArn: 'test-secret-arn',
                database: 'test-db',
                sql: expect.stringContaining('INSERT INTO seo_metrics'),
                parameters: expect.arrayContaining([
                    { name: 'restaurant_id', value: { stringValue: 'restaurant-1' } },
                    { name: 'metric_data', value: { stringValue: JSON.stringify(metrics) } }
                ])
            });
        });
    });

    describe('checkForCrisis', () => {
        const mockRestaurant = {
            id: 'restaurant-1',
            name: 'Test Restaurant'
        };

        const mockMetrics = {
            technical: { isAccessible: true, loadTimeMs: 2000 }
        };

        it('should return no crisis when Bedrock agent returns safe result', async () => {
            // Mock baseline data
            mockRDS.executeStatement.mockResolvedValue({
                records: [
                    [{ stringValue: JSON.stringify({ technical: { loadTimeMs: 2100 } }) }]
                ]
            });

            // Mock Bedrock response
            mockBedrock.invokeAgent.mockReturnValue({
                promise: jest.fn().mockResolvedValue({
                    completion: JSON.stringify({ hasCrisis: false })
                })
            });

            const result = await monitoringService.checkForCrisis(mockRestaurant, mockMetrics);

            expect(result.hasCrisis).toBe(false);
        });

        it('should use fallback detection when Bedrock fails', async () => {
            // Mock baseline data
            mockRDS.executeStatement.mockResolvedValue({
                records: [
                    [{ stringValue: JSON.stringify({ technical: { loadTimeMs: 2100 } }) }]
                ]
            });

            // Mock Bedrock error
            mockBedrock.invokeAgent.mockReturnValue({
                promise: jest.fn().mockRejectedValue(new Error('Bedrock error'))
            });

            const result = await monitoringService.checkForCrisis(mockRestaurant, mockMetrics);

            expect(result).toHaveProperty('hasCrisis');
        });

        it('should detect crisis when website is down', async () => {
            const criticalMetrics = {
                technical: { isAccessible: false }
            };

            // Mock baseline data
            mockRDS.executeStatement.mockResolvedValue({
                records: [
                    [{ stringValue: JSON.stringify({ technical: { isAccessible: true } }) }]
                ]
            });

            // Mock Bedrock error to trigger fallback
            mockBedrock.invokeAgent.mockReturnValue({
                promise: jest.fn().mockRejectedValue(new Error('Bedrock error'))
            });

            const result = await monitoringService.checkForCrisis(mockRestaurant, criticalMetrics);

            expect(result.hasCrisis).toBe(true);
            expect(result.crisisType).toBe('website_down');
            expect(result.severity).toBe('critical');
        });
    });

    describe('helper methods', () => {
        it('should format date correctly', () => {
            const date = new Date('2024-01-15T10:30:00Z');
            const formatted = monitoringService.formatDate(date);
            expect(formatted).toBe('2024-01-15');
        });

        it('should calculate average position correctly', () => {
            const rows = [
                { position: 5, impressions: 100 },
                { position: 10, impressions: 50 },
                { position: 15, impressions: 25 }
            ];

            const avgPosition = monitoringService.calculateAveragePosition(rows);
            expect(avgPosition).toBeCloseTo(7.86, 2);
        });

        it('should handle empty rows for average position', () => {
            const avgPosition = monitoringService.calculateAveragePosition([]);
            expect(avgPosition).toBe(0);
        });
    });
});