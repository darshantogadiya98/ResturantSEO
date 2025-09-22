#!/usr/bin/env node

/**
 * Google Docs to GitHub Markdown Synchronization Script
 * 
 * This script fetches content from a Google Doc and converts it to Markdown
 * format, then updates the corresponding GitHub documentation file.
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

/**
 * Configuration mapping Google Doc IDs to GitHub file paths
 */
const DOC_MAPPINGS = {
  // Add your Google Doc ID to file path mappings here
  // Example: 'your-google-doc-id': 'docs/api/API_DOCUMENTATION.md'
};

/**
 * Convert Google Docs content to Markdown format
 * @param {Object} content - Google Docs content structure
 * @returns {string} Markdown formatted content
 */
function convertToMarkdown(content) {
  let markdown = '';
  
  if (!content || !content.body || !content.body.content) {
    return markdown;
  }

  for (const element of content.body.content) {
    if (element.paragraph) {
      const paragraph = element.paragraph;
      let text = '';
      
      if (paragraph.elements) {
        for (const elem of paragraph.elements) {
          if (elem.textRun && elem.textRun.content) {
            let content = elem.textRun.content;
            
            // Apply text formatting
            if (elem.textRun.textStyle) {
              const style = elem.textRun.textStyle;
              if (style.bold) {
                content = `**${content}**`;
              }
              if (style.italic) {
                content = `*${content}*`;
              }
              if (style.link && style.link.url) {
                content = `[${content}](${style.link.url})`;
              }
            }
            
            text += content;
          }
        }
      }
      
      // Handle different paragraph styles
      if (paragraph.paragraphStyle && paragraph.paragraphStyle.namedStyleType) {
        const styleType = paragraph.paragraphStyle.namedStyleType;
        switch (styleType) {
          case 'HEADING_1':
            markdown += `# ${text}\n\n`;
            break;
          case 'HEADING_2':
            markdown += `## ${text}\n\n`;
            break;
          case 'HEADING_3':
            markdown += `### ${text}\n\n`;
            break;
          case 'HEADING_4':
            markdown += `#### ${text}\n\n`;
            break;
          case 'HEADING_5':
            markdown += `##### ${text}\n\n`;
            break;
          case 'HEADING_6':
            markdown += `###### ${text}\n\n`;
            break;
          default:
            if (text.trim()) {
              markdown += `${text}\n\n`;
            }
        }
      } else {
        if (text.trim()) {
          markdown += `${text}\n\n`;
        }
      }
    } else if (element.table) {
      // Handle tables
      markdown += convertTableToMarkdown(element.table);
    }
  }
  
  return markdown.trim();
}

/**
 * Convert Google Docs table to Markdown table
 * @param {Object} table - Google Docs table structure
 * @returns {string} Markdown table
 */
function convertTableToMarkdown(table) {
  let markdown = '';
  
  if (!table.tableRows) {
    return markdown;
  }
  
  const rows = table.tableRows;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let rowText = '|';
    
    if (row.tableCells) {
      for (const cell of row.tableCells) {
        let cellText = '';
        if (cell.content) {
          for (const element of cell.content) {
            if (element.paragraph && element.paragraph.elements) {
              for (const elem of element.paragraph.elements) {
                if (elem.textRun && elem.textRun.content) {
                  cellText += elem.textRun.content;
                }
              }
            }
          }
        }
        rowText += ` ${cellText.trim()} |`;
      }
    }
    
    markdown += `${rowText}\n`;
    
    // Add header separator for first row
    if (i === 0) {
      const cellCount = row.tableCells ? row.tableCells.length : 0;
      markdown += '|' + ' --- |'.repeat(cellCount) + '\n';
    }
  }
  
  return markdown + '\n';
}

/**
 * Initialize Google Docs API client
 * @returns {Object} Google Docs API client
 */
async function initializeGoogleDocs() {
  try {
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is required');
    }

    const credentials = JSON.parse(serviceAccountKey);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/documents.readonly']
    });

    return google.docs({ version: 'v1', auth });
  } catch (error) {
    console.error('Failed to initialize Google Docs API:', error.message);
    throw error;
  }
}

/**
 * Fetch and convert Google Doc to Markdown
 * @param {string} docId - Google Doc ID
 * @returns {string} Markdown content
 */
async function fetchAndConvertDoc(docId) {
  try {
    const docs = await initializeGoogleDocs();
    
    console.log(`Fetching Google Doc: ${docId}`);
    const response = await docs.documents.get({
      documentId: docId
    });
    
    console.log('Converting to Markdown...');
    const markdown = convertToMarkdown(response.data);
    
    return markdown;
  } catch (error) {
    console.error('Failed to fetch or convert document:', error.message);
    throw error;
  }
}

/**
 * Update GitHub file with new content
 * @param {string} filePath - Path to the file to update
 * @param {string} content - New content
 */
async function updateGitHubFile(filePath, content) {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    
    // Ensure directory exists
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });
    
    // Add metadata header
    const timestamp = new Date().toISOString();
    const header = `<!-- Auto-generated from Google Docs on ${timestamp} -->\n<!-- Do not edit this file directly - changes will be overwritten -->\n\n`;
    
    const finalContent = header + content;
    
    console.log(`Updating file: ${filePath}`);
    await fs.writeFile(fullPath, finalContent, 'utf8');
    
    console.log('File updated successfully');
  } catch (error) {
    console.error('Failed to update GitHub file:', error.message);
    throw error;
  }
}

/**
 * Main synchronization function
 */
async function main() {
  try {
    const docId = process.env.DOC_ID;
    const targetFile = process.env.TARGET_FILE;
    
    if (!docId) {
      throw new Error('DOC_ID environment variable is required');
    }
    
    if (!targetFile) {
      throw new Error('TARGET_FILE environment variable is required');
    }
    
    console.log('Starting Google Docs synchronization...');
    console.log(`Doc ID: ${docId}`);
    console.log(`Target file: ${targetFile}`);
    
    // Fetch and convert the document
    const markdown = await fetchAndConvertDoc(docId);
    
    if (!markdown.trim()) {
      console.warn('No content found in document');
      return;
    }
    
    // Update the GitHub file
    await updateGitHubFile(targetFile, markdown);
    
    console.log('Synchronization completed successfully!');
    
  } catch (error) {
    console.error('Synchronization failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  convertToMarkdown,
  fetchAndConvertDoc,
  updateGitHubFile
};