import { Groq } from "groq-sdk";
import { FactCheckContext, FactCheckResult, HealthCheckResult } from "../types";
// Import using a working approach
import * as francMin from 'franc-min';

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama3-70b-8192';

// Debug logging
console.log('Groq API Key length:', GROQ_API_KEY.length);
console.log('Groq Model:', GROQ_MODEL);

// Initialize Groq client
const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

/**
 * Detect the language of a text string using franc
 * @param text - The text to analyze
 * @returns The detected language code (ISO 639-3) or 'eng' if not detected
 */
function detectLanguage(text: string): string {
  try {
    // We need at least some text to detect the language
    if (!text || text.length < 10) {
      return 'eng'; // Default to English for very short texts
    }
    
    // Detect language (returns ISO 639-3 code)
    // Use the default function export from franc-min
    const detectedLanguage = francMin.franc(text);
    console.log('Detected language:', detectedLanguage);
    
    // If detection failed or returned 'und' (undefined)
    if (detectedLanguage === 'und') {
      return 'eng'; // Default to English
    }
    
    return detectedLanguage;
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'eng'; // Default to English if detection fails
  }
}

// Convert some common ISO 639-3 codes to more friendly names
function getLanguageName(languageCode: string): string {
  const languageMap: Record<string, string> = {
    'eng': 'English',
    'fra': 'French',
    'deu': 'German',
    'spa': 'Spanish',
    'ita': 'Italian',
    'por': 'Portuguese',
    'rus': 'Russian',
    'jpn': 'Japanese',
    'cmn': 'Mandarin Chinese',
    'kor': 'Korean',
    'ara': 'Arabic',
    'hin': 'Hindi',
    'nld': 'Dutch',
    'swe': 'Swedish',
    'fin': 'Finnish',
    'pol': 'Polish',
    'tur': 'Turkish',
    'ukr': 'Ukrainian',
    'heb': 'Hebrew',
    'vie': 'Vietnamese'
  };
  
  return languageMap[languageCode] || languageCode;
}

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
    // Detect the language of the message
    const detectedLanguageCode = detectLanguage(message);
    const detectedLanguageName = getLanguageName(detectedLanguageCode);
    
    // Create a prompt for fact-checking
    const prompt = createFactCheckPrompt(message, context, detectedLanguageCode, detectedLanguageName);
    
    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful multilingual fact-checking assistant that verifies factual claims and responds in JSON format. Always respond in the SAME LANGUAGE as the user's message in the content fields of your response."
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
function createFactCheckPrompt(
  message: string, 
  context: FactCheckContext, 
  languageCode: string, 
  languageName: string
): string {
  return `You will be given a message to analyze for factual accuracy.
Focus ONLY on verifiable factual claims in the message.

MESSAGE TO FACT-CHECK:
${message}

${context.history ? `RELEVANT CHAT HISTORY:\n${context.history}\n` : ''}

DETECTED LANGUAGE: ${languageName} (${languageCode})

Please evaluate the factual claims in this message and respond in the following JSON structure:
{
  "claims": [
    {
      "claim": "The exact claim from the message",
      "is_factual": "true" or "false" or "uncertain",
      "confidence": 0-1 (your confidence in the assessment),
      "explanation": "Brief explanation of your assessment",
      "sources": ["List of sources as URLs whenever possible"],
      "sources_label": "Translation of the word 'Sources' in the detected language"
    }
  ],
  "summary": "Brief overall assessment of the message's factual accuracy",
  "contains_claims": true or false
}

CRITICAL: For the "is_factual" field, use ONLY "true", "false", or "uncertain" WITH QUOTATION MARKS. DO NOT use boolean values without quotes.

IMPORTANT: For the "sources" field, provide complete and valid URLs to reliable sources whenever possible. These URLs will be displayed as clickable links in the UI to help users verify information. If a proper URL isn't available, provide the name of the source instead.

IMPORTANT: In the "sources_label" field, provide the translation of the word "Sources" in the user's language (${languageName}). This will be displayed as the label above the sources list in the UI.

VERY IMPORTANT: You MUST respond in the SAME LANGUAGE as the user's message (${languageName}). The entire response (including the "summary" and "explanation" fields) should be in ${languageName}. The only exceptions are the field names in the JSON structure, which should remain in English.

If there are no factual claims to check, set "contains_claims": false.
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
        claims: [],
        error: "Empty response",
        timestamp: new Date().toISOString()
      };
    }
    
    // Parse JSON from the response
    const factCheckResult = JSON.parse(responseContent);
    
    // Convert string is_factual values to booleans/null for consistency
    if (factCheckResult.claims && Array.isArray(factCheckResult.claims)) {
      factCheckResult.claims = factCheckResult.claims.map((claim: { is_factual: string }) => ({
        ...claim,
        is_factual: claim.is_factual === "true" ? true : 
                    claim.is_factual === "false" ? false : null
      }));
    }
    
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
      claims: [],
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