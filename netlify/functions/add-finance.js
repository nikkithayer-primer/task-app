/**
 * Netlify Function to add finance entry to GitHub
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'nikkithayer-primer';
const GITHUB_REPO = process.env.GITHUB_REPO || 'task-app';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

// Helper function to generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to get current file content
async function getFileContent(path) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Task-Tracker-App'
    }
  });

  if (response.status === 404) {
    return { data: [], sha: null };
  }

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const fileData = await response.json();
  const content = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf8'));
  
  return {
    data: content,
    sha: fileData.sha
  };
}

// Helper function to save file content
async function saveFileContent(path, data, sha = null) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
  const message = `Update ${path} - ${new Date().toISOString()}`;

  const body = {
    message,
    content,
    branch: GITHUB_BRANCH
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Task-Tracker-App'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`GitHub API error: ${response.status} - ${errorData.message || response.statusText}`);
  }

  return await response.json();
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!GITHUB_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'GitHub token not configured' })
    };
  }

  try {
    const entry = JSON.parse(event.body);
    
    // Validate required fields
    if (!entry.description || typeof entry.cost !== 'number' || typeof entry.worthIt !== 'boolean') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid entry data' })
      };
    }

    // Create entry with metadata
    const entryWithTimestamp = {
      ...entry,
      id: generateId(),
      timestamp: new Date().toISOString(),
      type: 'finance'
    };

    // Get current file content
    const path = 'data/finances.json';
    const fileData = await getFileContent(path);
    
    // Add new entry
    fileData.data.push(entryWithTimestamp);
    
    // Save updated content
    await saveFileContent(path, fileData.data, fileData.sha);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(entryWithTimestamp)
    };

  } catch (error) {
    console.error('Error adding finance entry:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to add finance entry' })
    };
  }
};
