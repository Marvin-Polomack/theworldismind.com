import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple redirect to status endpoint
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Location', '/api/status');
  res.status(302).end();
} 