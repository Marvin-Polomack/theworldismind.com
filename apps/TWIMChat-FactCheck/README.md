# TWIMChat Fact-Checking Service

A fact-checking service that uses Groq LLM to verify claims made in TWIMChat messages.
This service is built with TypeScript and designed for deployment on Vercel.

## Features

- Fact-checking of chat messages using Groq LLM API
- API endpoints for integration with TWIMChat
- TypeScript for type safety and better developer experience
- Optional authentication for API security
- Structured response with detailed fact assessments
- Vercel-ready for serverless deployment

## Prerequisites

- Node.js 18 or higher
- Groq API key

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and configure the settings:
   ```
   cp .env.example .env
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

- `PORT`: Port on which the server will run locally (default: 3002)
- `GROQ_API_KEY`: Your Groq API key (required)
- `GROQ_MODEL`: Model to use for fact-checking (default: llama3-70b-8192)
- `API_KEY`: Optional API key for authentication

## API Endpoints

### POST /api/factcheck

Checks facts in a provided message.

**Request Body:**
```json
{
  "message": "The message to fact-check",
  "context": {
    "history": "Optional chat history or additional context"
  }
}
```

**Response:**
```json
{
  "original_message": "The message that was fact-checked",
  "claims": [
    {
      "claim": "The exact claim from the message",
      "is_factual": true/false/uncertain,
      "confidence": 0.9,
      "explanation": "Explanation of the fact-check",
      "sources": ["Optional sources"]
    }
  ],
  "summary": "Overall assessment of factual accuracy",
  "contains_claims": true,
  "timestamp": "2023-12-01T12:00:00.000Z"
}
```

### GET /api/factcheck/status

Checks if the service is operational.

## Deployment on Vercel

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure the environment variables in the Vercel dashboard:
   - `GROQ_API_KEY`
   - `GROQ_MODEL` (optional, defaults to llama3-70b-8192)
   - `API_KEY` (optional)
4. Deploy the application

## Integration with TWIMChat

To integrate with TWIMChat:

1. Deploy this service on Vercel
2. Configure TWIMChat to send messages to the fact-checking API
3. Display fact-check results in the TWIMChat interface

## Development

- Build the project: `npm run build`
- Run tests: `npm test`
- Check linting: `npm run lint`

## License

This project is licensed under the ISC License. 