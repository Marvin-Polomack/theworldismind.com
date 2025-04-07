import dotenv from 'dotenv';
// Load environment variables first
dotenv.config({ path: '.env' });

// Debug logging
console.log('Environment variables loaded:');
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
console.log('GROQ_MODEL:', process.env.GROQ_MODEL);

import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import factCheckRouter from './routes/factCheck';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/factcheck', factCheckRouter);

// Default route
app.get('/', (_req: Request, res: Response) => {
  res.json({ 
    message: 'TWIMChat Fact-Checking Service',
    status: 'active',
    version: '1.0.0'
  });
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
};

app.use(errorHandler);

// Start server (only if not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for testing or serverless functions
export default app; 