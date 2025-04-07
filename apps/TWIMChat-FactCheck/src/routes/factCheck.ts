import { Router, Request, Response, NextFunction } from 'express';
import { checkMessageFacts, checkGroqHealth } from '../services/groqService.js';
import { apiKeyAuth } from '../middleware/auth.js';
import { FactCheckContext } from '../types/index.js';
import { z } from 'zod';

const router = Router();

// Request validation schema
const factCheckSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
  context: z.object({
    history: z.string().optional()
  }).optional().default({})
});

// Apply authentication middleware to all routes in this router
router.use(apiKeyAuth);

// POST /api/factcheck - Checks facts in a message
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const parseResult = factCheckSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: parseResult.error.format() 
      });
    }
    
    const { message, context } = parseResult.data;
    
    // Check facts in the message
    const result = await checkMessageFacts(message, context as FactCheckContext);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/factcheck/status - Check if service is operational
router.get('/status', async (_req: Request, res: Response) => {
  try {
    // Check Groq API connectivity
    const healthStatus = await checkGroqHealth();
    
    if (healthStatus.status === 'error') {
      return res.status(503).json(healthStatus);
    }
    
    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 