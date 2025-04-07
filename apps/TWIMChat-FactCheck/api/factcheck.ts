import { VercelRequest, VercelResponse } from '@vercel/node';
import { checkMessageFacts } from '../src/services/groqService';
import cors from 'cors';

// CORS headers
const allowedOrigins = [
  'https://theworldismind.com',
  'https://www.theworldismind.com',
  'https://twimchat.vercel.app',
  'https://twim-chat.vercel.app',
  'http://localhost:3000'
];

// API Key validation
const validateApiKey = (req: VercelRequest): boolean => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return true; // No API key configured, skip validation
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  
  const token = authHeader.split(' ')[1];
  return token === apiKey;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS handling
  const origin = req.headers.origin as string;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Validate API Key
  if (!validateApiKey(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const { message, context = {} } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid request: message is required' });
    }
    
    // Process fact checking
    const result = await checkMessageFacts(message, context);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handling fact check request:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 