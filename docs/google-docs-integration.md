# Google Docs Integration Setup Guide

This guide explains how to set up automatic synchronization between Google Docs and GitHub documentation files in the RestaurantGuard AI repository.

## 📋 Overview

The Google Docs integration allows you to:
- Write and edit documentation in Google Docs with collaborative features
- Automatically sync changes to GitHub markdown files
- Maintain version control while using familiar editing tools
- Trigger automated updates through webhooks or manual workflows

## 🏗️ Architecture

```
Google Docs → Google Drive API → Webhook Server → GitHub Actions → GitHub Repository
```

1. **Google Docs**: Source of truth for documentation content
2. **Google Drive API**: Monitors document changes and sends notifications
3. **Webhook Server**: Receives notifications and triggers GitHub workflows
4. **GitHub Actions**: Fetches doc content, converts to markdown, creates PR
5. **GitHub Repository**: Target for synchronized markdown files

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Setup Wizard

```bash
npm run docs:setup
```

This interactive setup will guide you through:
- Configuring document mappings
- Setting up Google Service Account
- Configuring webhooks

### 3. Configure Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google Docs API and Google Drive API
4. Create a Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Download JSON key file
5. Share your Google Docs with the service account email

### 4. Set GitHub Secrets

Add these secrets to your GitHub repository:

- `GOOGLE_SERVICE_ACCOUNT_KEY`: Content of the JSON key file
- `GITHUB_TOKEN`: GitHub personal access token (automatically available)

### 5. Configure Document Mappings

Edit `scripts/docs-sync/config.json` to map your Google Doc IDs to GitHub file paths:

```json
{
  "document_mappings": {
    "api_documentation": {
      "google_doc_id": "your-google-doc-id-here",
      "github_file_path": "docs/api/API_DOCUMENTATION.md"
    }
  }
}
```

## 📖 Usage

### Manual Sync

Trigger a manual sync using GitHub Actions:

1. Go to Actions tab in GitHub
2. Select "Sync Google Docs to GitHub" workflow
3. Click "Run workflow"
4. Enter Google Doc ID and target file path

### Automatic Sync (Webhook)

For automatic syncing when documents change:

1. Deploy the webhook server:
   ```bash
   npm run docs:webhook
   ```

2. Configure Google Drive API push notifications to point to your webhook endpoint

### Command Line Tools

```bash
# Run setup wizard
npm run docs:setup

# Manual sync (requires environment variables)
DOC_ID="your-doc-id" TARGET_FILE="docs/example.md" npm run docs:sync

# Start webhook server
npm run docs:webhook
```

## 🔧 Configuration

### Document Mappings

Edit `scripts/docs-sync/config.json`:

```json
{
  "document_mappings": {
    "api_documentation": {
      "google_doc_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      "github_file_path": "docs/api/API_DOCUMENTATION.md",
      "description": "API Documentation"
    },
    "deployment_guide": {
      "google_doc_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      "github_file_path": "docs/deployment/DEPLOYMENT_GUIDE.md",
      "description": "Deployment Guide"
    }
  }
}
```

### Sync Options

```json
{
  "sync_options": {
    "auto_create_pr": true,
    "pr_title_prefix": "docs: sync from Google Docs",
    "include_metadata_header": true
  }
}
```

## 🛡️ Security

### Service Account Permissions

The Google Service Account needs:
- Read access to Google Docs
- Viewer permission on target documents

### Webhook Security

- Use webhook secrets for verification
- Deploy webhook server with HTTPS
- Limit webhook access to Google's IP ranges

### GitHub Permissions

Required GitHub token permissions:
- `contents:write` - Update repository files
- `pull-requests:write` - Create pull requests
- `actions:write` - Trigger workflows

## 🔍 Monitoring

### Webhook Health Check

```bash
curl https://your-webhook-domain.com/health
```

### GitHub Actions Logs

Monitor sync operations in:
- GitHub Actions tab
- Workflow run logs
- CloudWatch (if using AWS Lambda)

## 🐛 Troubleshooting

### Common Issues

**1. "Failed to fetch document"**
- Check service account permissions
- Verify document is shared with service account email
- Ensure Google Docs API is enabled

**2. "Webhook not triggering"**
- Verify webhook URL is accessible
- Check Google Drive API push notification setup
- Validate webhook secret configuration

**3. "GitHub Actions not running"**
- Check repository dispatch event configuration
- Verify GitHub token permissions
- Review workflow file syntax

### Debug Mode

Enable debug logging:

```bash
DEBUG=true npm run docs:sync
```

### Test Manual Trigger

Test the webhook manually:

```bash
curl -X POST https://your-webhook-domain.com/trigger \
  -H "Content-Type: application/json" \
  -d '{"doc_id":"your-doc-id","target_file":"docs/test.md"}'
```

## 📚 API Reference

### Webhook Endpoints

- `GET /health` - Health check
- `GET /config` - Show configuration
- `POST /webhook/google-docs` - Google Drive webhook
- `POST /trigger` - Manual trigger endpoint

### Environment Variables

- `GOOGLE_SERVICE_ACCOUNT_KEY` - Google service account JSON key
- `GITHUB_TOKEN` - GitHub personal access token
- `GITHUB_OWNER` - Repository owner (darshantogadiya98)
- `GITHUB_REPO` - Repository name (ResturantSEO)
- `WEBHOOK_SECRET` - Webhook verification secret
- `DOC_ID` - Google Doc ID (for manual sync)
- `TARGET_FILE` - Target GitHub file path (for manual sync)

## 🔄 Conversion Features

### Supported Formatting

- **Headers**: H1-H6 → `# ## ### #### ##### ######`
- **Bold**: Bold text → `**bold**`
- **Italic**: Italic text → `*italic*`
- **Links**: Hyperlinks → `[text](url)`
- **Tables**: Google Docs tables → Markdown tables
- **Lists**: Bullet and numbered lists

### Metadata Headers

Synchronized files include metadata:

```markdown
<!-- Auto-generated from Google Docs on 2024-01-15T10:30:00Z -->
<!-- Do not edit this file directly - changes will be overwritten -->
```

## 🚀 Deployment Options

### Option 1: Express Server

Deploy `webhook-server.js` to any Node.js hosting platform:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

### Option 2: AWS Lambda

Use the generated Lambda function for serverless deployment:

```bash
# Generate Lambda code
npm run docs:setup
# Select option 4 to generate lambda-webhook.js
```

### Option 3: Cloud Functions

Adapt the webhook code for Google Cloud Functions or Azure Functions.

## 📝 Best Practices

1. **Document Structure**: Use clear headings and consistent formatting in Google Docs
2. **Review Process**: Always review generated PRs before merging
3. **Backup**: Keep backups of important documentation
4. **Testing**: Test the integration with non-critical documents first
5. **Monitoring**: Set up alerts for failed sync operations

## 🤝 Support

For issues and questions:
- Check the troubleshooting section above
- Review GitHub Actions logs
- Open an issue in the repository
- Check Google Drive API documentation

## 🔗 Related Links

- [Google Docs API Documentation](https://developers.google.com/docs/api)
- [Google Drive API Push Notifications](https://developers.google.com/drive/api/v3/push)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Octokit REST API](https://octokit.github.io/rest.js/)