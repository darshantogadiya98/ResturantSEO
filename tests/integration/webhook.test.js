const request = require('supertest');
const app = require('../../scripts/docs-sync/webhook-server');

// Mock the Octokit GitHub client
jest.mock('@octokit/rest', () => {
  return {
    Octokit: jest.fn().mockImplementation(() => ({
      repos: {
        createDispatchEvent: jest.fn().mockResolvedValue({})
      }
    }))
  };
});

describe('Webhook Server', () => {
  beforeEach(() => {
    // Set environment variables for testing
    process.env.GITHUB_TOKEN = 'test-token';
    process.env.GITHUB_OWNER = 'test-owner';
    process.env.GITHUB_REPO = 'test-repo';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('mappings');
    });
  });

  describe('GET /config', () => {
    test('should return configuration', async () => {
      const response = await request(app)
        .get('/config')
        .expect(200);

      expect(response.body).toHaveProperty('github_repo', 'darshantogadiya98/ResturantSEO');
      expect(response.body).toHaveProperty('doc_mappings');
      expect(response.body).toHaveProperty('webhook_configured');
    });
  });

  describe('POST /trigger', () => {
    test('should trigger sync with valid parameters', async () => {
      const payload = {
        doc_id: 'test-doc-id',
        target_file: 'docs/test.md'
      };

      const response = await request(app)
        .post('/trigger')
        .send(payload)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Sync triggered successfully');
      expect(response.body).toHaveProperty('doc_id', 'test-doc-id');
      expect(response.body).toHaveProperty('target_file', 'docs/test.md');
    });

    test('should return 400 for missing parameters', async () => {
      const payload = {
        doc_id: 'test-doc-id'
        // missing target_file
      };

      const response = await request(app)
        .post('/trigger')
        .send(payload)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'doc_id and target_file are required');
    });

    test('should return 400 for empty parameters', async () => {
      const payload = {};

      const response = await request(app)
        .post('/trigger')
        .send(payload)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'doc_id and target_file are required');
    });
  });

  describe('POST /webhook/google-docs', () => {
    test('should handle webhook without signature verification when secret not set', async () => {
      // Ensure webhook secret is not set
      delete process.env.WEBHOOK_SECRET;

      const payload = {
        resourceId: 'test-doc-id'
      };

      const response = await request(app)
        .post('/webhook/google-docs')
        .send(payload)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Document not mapped for sync');
    });

    test('should return 400 for invalid notification format', async () => {
      const payload = {
        // Missing resourceId or resourceUri
        someOtherField: 'value'
      };

      const response = await request(app)
        .post('/webhook/google-docs')
        .send(payload)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid notification format');
    });

    test('should extract doc ID from resourceUri', async () => {
      const payload = {
        resourceUri: 'https://docs.google.com/documents/test-doc-id/edit'
      };

      const response = await request(app)
        .post('/webhook/google-docs')
        .send(payload)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Document not mapped for sync');
    });
  });
});