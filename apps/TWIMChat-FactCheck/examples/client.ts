/**
 * Example client for the TWIMChat Fact-Checking Service
 * This demonstrates how to integrate with the service from a client application
 */

import axios from 'axios';
import { FactCheckContext, FactCheckResult, HealthCheckResult } from '../src/types';

// Configuration
const API_URL = process.env.FACTCHECK_API_URL || 'http://localhost:3001/api/factcheck';
const API_KEY = process.env.FACTCHECK_API_KEY; // Optional

/**
 * Check facts in a message
 * @param message - The message to fact-check
 * @param context - Optional context (chat history, etc.)
 * @returns Fact checking results
 */
export async function checkFacts(
  message: string, 
  context: FactCheckContext = {}
): Promise<FactCheckResult> {
  try {
    // Set up headers if API key is configured
    const headers: Record<string, string> = {};
    if (API_KEY) {
      headers.Authorization = `Bearer ${API_KEY}`;
    }
    
    // Make API request
    const response = await axios.post<FactCheckResult>(API_URL, {
      message,
      context
    }, { headers });
    
    return response.data;
  } catch (error) {
    console.error('Error checking facts:', error);
    throw error;
  }
}

/**
 * Check the status of the fact-checking service
 * @returns Service status
 */
export async function checkStatus(): Promise<HealthCheckResult> {
  try {
    // Set up headers if API key is configured
    const headers: Record<string, string> = {};
    if (API_KEY) {
      headers.Authorization = `Bearer ${API_KEY}`;
    }
    
    // Make API request
    const response = await axios.get<HealthCheckResult>(`${API_URL}/status`, { headers });
    
    return response.data;
  } catch (error) {
    console.error('Error checking service status:', error);
    throw error;
  }
}

// Example usage
async function runExample(): Promise<void> {
  try {
    // Check service status
    console.log('Checking service status...');
    const status = await checkStatus();
    console.log('Service status:', status);
    
    if (status.status !== 'operational') {
      console.error('Service is not operational');
      return;
    }
    
    // Example messages to fact-check
    const messages = [
      'The Earth is flat.',
      'Water boils at 100 degrees Celsius at sea level.',
      'The capital of France is London.',
      'Hello, how are you today?', // No factual claims
    ];
    
    // Check facts for each message
    for (const message of messages) {
      console.log('\n--- Checking facts for:', message);
      const result = await checkFacts(message);
      console.log('Result:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('Example failed:', error instanceof Error ? error.message : error);
  }
}

// Run the example if this script is executed directly
if (require.main === module) {
  runExample();
} 