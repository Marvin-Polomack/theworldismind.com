import { Groq } from "groq-sdk";
import { FactCheckContext, FactCheckResult, HealthCheckResult } from "../types";

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama3-70b-8192';

// Initialize Groq client
const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

/**
 * Check facts in a message using Groq LLM
 * @param message - The message to fact-check
 * @param context - Optional context (chat history, etc.)
 * @returns Fact checking results
 */
export async function checkMessageFacts(
  message: string, 
  context: FactCheckContext = {}
): Promise<FactCheckResult> {
  try {
    // Create a prompt for fact-checking
    const prompt = createFactCheckPrompt(message, context);
    
    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful fact-checking assistant that verifies factual claims and responds in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: GROQ_MODEL,
      temperature: 0.1, // Lower temperature for more factual responses
      response_format: { type: "json_object" }
    });
    
    // Process the response
    const result = processFactCheckResponse(completion.choices[0]?.message?.content || '', message);
    
    return result;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw new Error('Failed to check facts with Groq LLM');
  }
}

/**
 * Creates a prompt for fact-checking
 */
function createFactCheckPrompt(message: string, context: FactCheckContext): string {
  return `You will be given a message to analyze for factual accuracy.
Focus ONLY on verifiable factual claims in the message.

MESSAGE TO FACT-CHECK:
${message}

${context.history ? `RELEVANT CHAT HISTORY:\n${context.history}\n` : ''}

Please evaluate the factual claims in this message and respond in the following JSON structure:
{
  "claims": [
    {
      "claim": "The exact claim from the message",
      "is_factual": true/false/uncertain,
      "confidence": 0-1 (your confidence in the assessment),
      "explanation": "Brief explanation of your assessment",
      "sources": ["optional sources if you can provide any"]
    }
  ],
  "summary": "Brief overall assessment of the message's factual accuracy",
  "contains_claims": true/false
}

If there are no factual claims to check, set "contains_claims" to false.
`;
}

/**
 * Process the LLM response into a structured format
 */
function processFactCheckResponse(responseContent: string, originalMessage: string): FactCheckResult {
  try {
    if (!responseContent) {
      return {
        original_message: originalMessage,
        contains_claims: false,
        summary: "No response received from LLM",
        error: "Empty response",
        timestamp: new Date().toISOString()
      };
    }
    
    // Parse JSON from the response
    const factCheckResult = JSON.parse(responseContent);
    
    return {
      ...factCheckResult,
      original_message: originalMessage,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error processing fact-check response:', error);
    return {
      original_message: originalMessage,
      contains_claims: false,
      summary: "Error processing fact-check",
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Check if Groq API is reachable and the model is available
 * @returns Health check result
 */
export async function checkGroqHealth(): Promise<HealthCheckResult> {
  try {
    // Simple call to validate API connection
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Hello"
        }
      ],
      model: GROQ_MODEL,
      max_tokens: 5
    });
    
    const apiReachable = completion.choices && completion.choices.length > 0;
    
    return {
      status: 'operational',
      api_reachable: apiReachable,
      model_available: true,
      model: GROQ_MODEL,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Groq health check failed:', error);
    return {
      status: 'error',
      api_reachable: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
} 