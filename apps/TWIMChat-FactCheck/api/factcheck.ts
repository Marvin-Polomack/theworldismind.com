import { VercelRequest, VercelResponse } from '@vercel/node';
import factCheckRouter from '../src/routes/factCheck';
import express from 'express';
import cors from 'cors';

// Create Express instance for this specific route
const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://theworldismind.com',
    'https://www.theworldismind.com',
    'https://twimchat.vercel.app',
    'https://twim-chat.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Use the factCheck router
app.use('/', factCheckRouter);

// Create a handler for Vercel serverless function
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Use express app as middleware
  return app(req, res);
}; 