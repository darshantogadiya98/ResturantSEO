#!/usr/bin/env node

/**
 * Google Docs Integration Setup Script
 * 
 * This script helps set up the Google Docs to GitHub integration
 * by configuring credentials, webhooks, and document mappings.
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const CONFIG_PATH = path.join(__dirname, 'config.json');

/**
 * Create readline interface for user input
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Prompt user for input
 * @param {string} question - Question to ask
 * @returns {Promise<string>} User's answer
 */
function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

/**
 * Load configuration file
 * @returns {Object} Configuration object
 */
async function loadConfig() {
  try {
    const configData = await fs.readFile(CONFIG_PATH, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Failed to load configuration:', error.message);
    throw error;
  }
}

/**
 * Save configuration file
 * @param {Object} config - Configuration object
 */
async function saveConfig(config) {
  try {
    const configData = JSON.stringify(config, null, 2);
    await fs.writeFile(CONFIG_PATH, configData, 'utf8');
    console.log('Configuration saved successfully!');
  } catch (error) {
    console.error('Failed to save configuration:', error.message);
    throw error;
  }
}

/**
 * Setup Google Docs mappings
 * @param {Object} config - Configuration object
 */
async function setupDocumentMappings(config) {
  console.log('\n📄 Setting up Google Docs mappings...\n');
  
  for (const [key, mapping] of Object.entries(config.document_mappings)) {
    console.log(`\n${mapping.description}`);
    console.log(`GitHub file: ${mapping.github_file_path}`);
    
    const currentDocId = mapping.google_doc_id || 'Not set';
    console.log(`Current Google Doc ID: ${currentDocId}`);
    
    const newDocId = await ask('Enter Google Doc ID (or press Enter to skip): ');
    
    if (newDocId.trim()) {
      config.document_mappings[key].google_doc_id = newDocId.trim();
      console.log('✅ Updated mapping');
    } else {
      console.log('⏭️  Skipped');
    }
  }
}

/**
 * Generate service account setup instructions
 */
function showServiceAccountInstructions() {
  console.log('\n🔐 Google Service Account Setup Instructions:\n');
  console.log('1. Go to Google Cloud Console (https://console.cloud.google.com/)');
  console.log('2. Create a new project or select existing project');
  console.log('3. Enable the Google Docs API and Google Drive API');
  console.log('4. Go to "IAM & Admin" > "Service Accounts"');
  console.log('5. Click "Create Service Account"');
  console.log('6. Fill in service account details and click "Create"');
  console.log('7. Skip granting roles (click "Continue")');
  console.log('8. Click "Create Key" and select "JSON"');
  console.log('9. Download the JSON key file');
  console.log('10. Share your Google Docs with the service account email (found in the JSON file)');
  console.log('\n📋 Next steps:');
  console.log('- Store the JSON key content in AWS Secrets Manager or as a GitHub secret');
  console.log('- Use the secret name: GOOGLE_SERVICE_ACCOUNT_KEY');
  console.log('- The JSON should be stored as a string (entire file content)');
}

/**
 * Generate webhook setup instructions
 */
function showWebhookInstructions() {
  console.log('\n🔗 Webhook Setup Instructions:\n');
  console.log('1. Deploy the webhook server (webhook-server.js) to a publicly accessible endpoint');
  console.log('2. Ensure your server has the following environment variables:');
  console.log('   - GITHUB_TOKEN: GitHub personal access token with repo permissions');
  console.log('   - GITHUB_OWNER: Repository owner (darshantogadiya98)');
  console.log('   - GITHUB_REPO: Repository name (ResturantSEO)');
  console.log('   - WEBHOOK_SECRET: Secret for webhook verification');
  console.log('3. Configure Google Drive API push notifications:');
  console.log('   - Use Google Drive API to watch for changes');
  console.log('   - Set webhook URL to: https://your-domain.com/webhook/google-docs');
  console.log('4. Test the webhook using the manual trigger endpoint');
}

/**
 * Generate AWS Lambda deployment for webhook
 */
async function generateLambdaDeployment() {
  console.log('\n☁️  Generating AWS Lambda deployment...\n');
  
  const lambdaCode = `
const { google } = require('googleapis');
const { Octokit } = require('@octokit/rest');

exports.handler = async (event) => {
  try {
    // Parse the incoming webhook
    const body = JSON.parse(event.body);
    
    // Extract document ID from Google Drive notification
    const docId = extractDocId(body);
    
    if (!docId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid notification' })
      };
    }
    
    // Check document mapping
    const targetFile = getDocumentMapping(docId);
    
    if (!targetFile) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Document not mapped for sync' })
      };
    }
    
    // Trigger GitHub Actions workflow
    const github = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    
    await github.repos.createDispatchEvent({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      event_type: 'google-docs-updated',
      client_payload: {
        doc_id: docId,
        target_file: targetFile,
        timestamp: new Date().toISOString()
      }
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Sync triggered successfully',
        doc_id: docId,
        target_file: targetFile
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

function extractDocId(notification) {
  // Implementation to extract doc ID from Google Drive notification
  return notification.resourceId || null;
}

function getDocumentMapping(docId) {
  const mappings = {
    // Add your document mappings here
  };
  return mappings[docId] || null;
}
`;

  try {
    await fs.writeFile(
      path.join(__dirname, 'lambda-webhook.js'),
      lambdaCode,
      'utf8'
    );
    console.log('✅ Lambda webhook code generated: lambda-webhook.js');
  } catch (error) {
    console.error('Failed to generate Lambda code:', error.message);
  }
}

/**
 * Main setup function
 */
async function main() {
  console.log('🚀 Google Docs to GitHub Integration Setup\n');
  
  try {
    const config = await loadConfig();
    
    console.log('Current configuration loaded successfully!');
    console.log(`Repository: ${config.github.owner}/${config.github.repo}`);
    
    const action = await ask('\nWhat would you like to do?\n1. Setup document mappings\n2. View service account instructions\n3. View webhook instructions\n4. Generate Lambda webhook\n5. Save and exit\n\nEnter option (1-5): ');
    
    switch (action.trim()) {
      case '1':
        await setupDocumentMappings(config);
        await saveConfig(config);
        break;
      case '2':
        showServiceAccountInstructions();
        break;
      case '3':
        showWebhookInstructions();
        break;
      case '4':
        await generateLambdaDeployment();
        break;
      case '5':
        console.log('👋 Goodbye!');
        break;
      default:
        console.log('Invalid option selected');
    }
    
  } catch (error) {
    console.error('Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run setup if called directly
if (require.main === module) {
  main();
}

module.exports = {
  loadConfig,
  saveConfig,
  setupDocumentMappings
};