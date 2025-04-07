import { VercelRequest, VercelResponse } from '@vercel/node';
import { checkMessageFacts } from '../src/services/groqService.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported for this endpoint'
    });
  }

  // Check if GROQ API key is set
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      error: 'Configuration error',
      message: 'GROQ_API_KEY environment variable is not set'
    });
  }
  
  try {
    const { message, context = {} } = req.body || {};
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Message is required and must be a string'
      });
    }
    
    // Process fact checking
    const result = await checkMessageFacts(message, context);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handling fact check request:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
} 