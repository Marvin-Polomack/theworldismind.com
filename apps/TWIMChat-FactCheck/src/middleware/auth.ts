import { Request, Response, NextFunction } from 'express';

/**
 * Simple API key authentication middleware
 * Will only be active if API_KEY is set in environment variables
 */
export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = process.env.API_KEY;
  
  // If no API key is configured, skip authentication
  if (!apiKey) {
    return next();
  }
  
  // Check the authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  if (token !== apiKey) {
    res.status(403).json({ error: 'Invalid API key' });
    return;
  }
  
  // Authentication successful
  next();
} 