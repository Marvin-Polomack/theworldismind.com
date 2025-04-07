import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Check if GROQ API key is set
    const groqKeyStatus = process.env.GROQ_API_KEY ? 'configured' : 'missing';
    
    return res.status(200).json({
      service: 'TWIMChat Fact-Checking API',
      status: 'active',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      groq_api: groqKeyStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking service health:', error);
    return res.status(500).json({
      service: 'TWIMChat Fact-Checking API',
      status: 'error',
      version: '1.0.0',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
} 