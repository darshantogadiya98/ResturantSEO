#!/usr/bin/env node

/**
 * Demo script for Google Docs integration
 * This script demonstrates the Google Docs to GitHub sync functionality
 */

const { convertToMarkdown, updateGitHubFile } = require('./sync-google-doc');
const path = require('path');

/**
 * Sample Google Doc content structure for demonstration
 */
const sampleGoogleDocContent = {
  body: {
    content: [
      {
        paragraph: {
          elements: [
            {
              textRun: {
                content: 'API Documentation\n'
              }
            }
          ],
          paragraphStyle: {
            namedStyleType: 'HEADING_1'
          }
        }
      },
      {
        paragraph: {
          elements: [
            {
              textRun: {
                content: 'Overview\n'
              }
            }
          ],
          paragraphStyle: {
            namedStyleType: 'HEADING_2'
          }
        }
      },
      {
        paragraph: {
          elements: [
            {
              textRun: {
                content: 'This API provides comprehensive access to the RestaurantGuard AI system. '
              }
            },
            {
              textRun: {
                content: 'Key features',
                textStyle: {
                  bold: true
                }
              }
            },
            {
              textRun: {
                content: ' include:\n'
              }
            }
          ]
        }
      },
      {
        paragraph: {
          elements: [
            {
              textRun: {
                content: '- Real-time SEO monitoring\n'
              }
            }
          ]
        }
      },
      {
        paragraph: {
          elements: [
            {
              textRun: {
                content: '- Automated crisis response\n'
              }
            }
          ]
        }
      },
      {
        paragraph: {
          elements: [
            {
              textRun: {
                content: '- AI-powered content optimization\n'
              }
            }
          ]
        }
      },
      {
        paragraph: {
          elements: [
            {
              textRun: {
                content: 'For more information, visit our '
              }
            },
            {
              textRun: {
                content: 'documentation site',
                textStyle: {
                  link: {
                    url: 'https://docs.restaurantguard.ai'
                  }
                }
              }
            },
            {
              textRun: {
                content: '.\n'
              }
            }
          ]
        }
      },
      {
        paragraph: {
          elements: [
            {
              textRun: {
                content: 'Authentication\n'
              }
            }
          ],
          paragraphStyle: {
            namedStyleType: 'HEADING_2'
          }
        }
      },
      {
        paragraph: {
          elements: [
            {
              textRun: {
                content: 'API authentication uses '
              }
            },
            {
              textRun: {
                content: 'AWS Signature Version 4',
                textStyle: {
                  italic: true
                }
              }
            },
            {
              textRun: {
                content: ' for secure access.\n'
              }
            }
          ]
        }
      }
    ]
  }
};

/**
 * Run the demo
 */
async function runDemo() {
  console.log('🚀 Google Docs Integration Demo\n');
  
  try {
    // Convert sample Google Doc content to Markdown
    console.log('📄 Converting Google Doc content to Markdown...');
    const markdown = convertToMarkdown(sampleGoogleDocContent);
    
    console.log('\n✅ Conversion successful! Here\'s the result:\n');
    console.log('--- MARKDOWN OUTPUT ---');
    console.log(markdown);
    console.log('--- END OUTPUT ---\n');
    
    // Create a demo file
    const demoFilePath = path.join('/tmp', 'demo-google-docs-sync.md');
    console.log(`📝 Creating demo file: ${demoFilePath}`);
    
    await updateGitHubFile(demoFilePath, markdown);
    
    console.log('\n✅ Demo completed successfully!');
    console.log('\nThis demonstrates how Google Docs content is automatically:');
    console.log('1. Fetched from Google Docs API');
    console.log('2. Converted to properly formatted Markdown');
    console.log('3. Updated in GitHub with metadata headers');
    console.log('4. Committed via automated pull requests');
    
    console.log('\n🔧 Next steps to set up the integration:');
    console.log('1. Run: npm run docs:setup');
    console.log('2. Configure your Google service account');
    console.log('3. Map your Google Doc IDs to GitHub file paths');
    console.log('4. Set up the webhook server or use manual triggers');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    throw error;
  }
}

// Run demo if called directly
if (require.main === module) {
  runDemo().catch(error => {
    console.error('Demo error:', error);
    process.exit(1);
  });
}

module.exports = { sampleGoogleDocContent, runDemo };