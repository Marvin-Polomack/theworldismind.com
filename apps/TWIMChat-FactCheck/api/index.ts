import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/index';
import express from 'express';

// Create a handler for Vercel serverless function
const handler = (req: VercelRequest, res: VercelResponse) => {
  // Use express app as middleware
  app(req, res);
};

export default handler; 