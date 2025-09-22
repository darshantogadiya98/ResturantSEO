const express = require('express');
const crypto = require('crypto');
const { Octokit } = require('@octokit/rest');

/**
 * Google Docs Webhook Handler
 * 
 * This Express.js application handles webhooks from Google Drive API
 * when documents are updated and triggers GitHub Actions workflows
 * to synchronize the content.
 */

const app = express();
app.use(express.json());

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'darshantogadiya98';
const GITHUB_REPO = process.env.GITHUB_REPO || 'ResturantSEO';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// Document mappings - maps Google Doc IDs to GitHub file paths
const DOC_MAPPINGS = {
  // Example mappings - replace with your actual Google Doc IDs
  // 'your-api-doc-id': 'docs/api/API_DOCUMENTATION.md',
  // 'your-deployment-doc-id': 'docs/deployment/DEPLOYMENT_GUIDE.md',
  // 'your-readme-doc-id': 'README.md'
};

/**
 * Initialize GitHub client
 */
const github = new Octokit({
  auth: GITHUB_TOKEN,
});

/**
 * Verify webhook signature
 * @param {string} payload - Request payload
 * @param {string} signature - Webhook signature
 * @returns {boolean} Whether signature is valid
 */
function verifyWebhookSignature(payload, signature) {
  if (!WEBHOOK_SECRET) {
    console.warn('WEBHOOK_SECRET not configured - skipping signature verification');
    return true;
  }

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

/**
 * Trigger GitHub Actions workflow
 * @param {string} docId - Google Doc ID
 * @param {string} targetFile - Target GitHub file path
 */
async function triggerSync(docId, targetFile) {
  try {
    console.log(`Triggering sync for doc ${docId} -> ${targetFile}`);
    
    await github.repos.createDispatchEvent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      event_type: 'google-docs-updated',
      client_payload: {
        doc_id: docId,
        target_file: targetFile,
        timestamp: new Date().toISOString()
      }
    });
    
    console.log('GitHub Actions workflow triggered successfully');
  } catch (error) {
    console.error('Failed to trigger GitHub Actions workflow:', error.message);
    throw error;
  }
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    mappings: Object.keys(DOC_MAPPINGS).length
  });
});

/**
 * Configuration endpoint - shows current document mappings
 */
app.get('/config', (req, res) => {
  res.json({
    github_repo: `${GITHUB_OWNER}/${GITHUB_REPO}`,
    doc_mappings: DOC_MAPPINGS,
    webhook_configured: !!WEBHOOK_SECRET
  });
});

/**
 * Google Drive webhook endpoint
 */
app.post('/webhook/google-docs', async (req, res) => {
  try {
    const signature = req.headers['x-goog-channel-token'];
    const payload = JSON.stringify(req.body);
    
    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    const notification = req.body;
    console.log('Received Google Docs notification:', notification);
    
    // Extract document ID from the notification
    let docId = null;
    if (notification.resourceId) {
      docId = notification.resourceId;
    } else if (notification.resourceUri) {
      // Extract doc ID from URI
      const match = notification.resourceUri.match(/\/documents\/([a-zA-Z0-9-_]+)/);
      if (match) {
        docId = match[1];
      }
    }
    
    if (!docId) {
      console.error('Could not extract document ID from notification');
      return res.status(400).json({ error: 'Invalid notification format' });
    }
    
    // Check if we have a mapping for this document
    const targetFile = DOC_MAPPINGS[docId];
    if (!targetFile) {
      console.log(`No mapping found for document ${docId} - ignoring`);
      return res.status(200).json({ message: 'Document not mapped for sync' });
    }
    
    // Trigger the synchronization
    await triggerSync(docId, targetFile);
    
    res.status(200).json({ 
      message: 'Sync triggered successfully',
      doc_id: docId,
      target_file: targetFile
    });
    
  } catch (error) {
    console.error('Webhook processing failed:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Manual trigger endpoint for testing
 */
app.post('/trigger', async (req, res) => {
  try {
    const { doc_id, target_file } = req.body;
    
    if (!doc_id || !target_file) {
      return res.status(400).json({ 
        error: 'doc_id and target_file are required' 
      });
    }
    
    await triggerSync(doc_id, target_file);
    
    res.json({ 
      message: 'Sync triggered successfully',
      doc_id,
      target_file
    });
    
  } catch (error) {
    console.error('Manual trigger failed:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Error handling middleware
 */
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Google Docs webhook server listening on port ${PORT}`);
  console.log(`Configured mappings: ${Object.keys(DOC_MAPPINGS).length}`);
  console.log(`GitHub repo: ${GITHUB_OWNER}/${GITHUB_REPO}`);
});

module.exports = app;