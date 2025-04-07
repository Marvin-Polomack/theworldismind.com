import { NextRequest, NextResponse } from 'next/server';

// Define runtime for edge compatibility if needed
export const runtime = 'nodejs'; // or 'edge' if you want to use edge runtime

// Set appropriate cache control
export const dynamic = 'force-dynamic'; // Ensure the route isn't cached

// Environment variables (these are server-side only)
const FACT_CHECK_API_URL = process.env.FACT_CHECK_API_URL || 'https://twim-chat-fact-check.vercel.app/api/factcheck';
const FACT_CHECK_API_KEY = process.env.FACT_CHECK_API_KEY;

// Define OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}

export async function POST(request: NextRequest) {
  // Set common headers for CORS
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  });

  // Verify that the API key is configured
  if (!FACT_CHECK_API_KEY) {
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Fact-checking service is not configured' 
      },
      { 
        status: 503,
        headers 
      }
    );
  }

  try {
    // Parse the request body
    const body = await request.json();
    
    // Forward the request to the fact-check API with the API key
    const response = await fetch(FACT_CHECK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FACT_CHECK_API_KEY}`
      },
      body: JSON.stringify(body),
      // Add a reasonable timeout
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    // If the response is not OK, throw an error
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to check facts: ${response.statusText}`, errorText);
      
      return NextResponse.json(
        { 
          status: 'error',
          error: `Failed to check facts: ${response.status} - ${response.statusText}`,
          details: errorText.substring(0, 200) // Limit error text length
        },
        { 
          status: response.status,
          headers 
        }
      );
    }

    // Return the result from the fact-check API
    const factCheckResult = await response.json();
    
    return NextResponse.json(
      { 
        status: 'success',
        ...factCheckResult 
      },
      { 
        status: 200,
        headers,
        // Set appropriate cache control headers
        statusText: 'OK'
      }
    );
    
  } catch (error) {
    console.error('Error in fact-check API route:', error);
    
    // Determine if it's a timeout error
    const message = error instanceof Error 
      ? error.name === 'TimeoutError' 
        ? 'Request to fact-check service timed out' 
        : error.message
      : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Internal server error processing fact-check request',
        message
      },
      { 
        status: 500,
        headers
      }
    );
  }
} 