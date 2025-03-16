export interface FactCheckClaim {
  claim: string;
  is_factual: boolean | "uncertain";
  confidence: number;
  explanation: string;
  sources?: string[];
}

export interface FactCheckContext {
  history?: string;
  [key: string]: any;
}

export interface FactCheckResult {
  original_message: string;
  claims?: FactCheckClaim[];
  summary: string;
  contains_claims: boolean;
  error?: string;
  timestamp: string;
}

export interface HealthCheckResult {
  status: 'operational' | 'error';
  api_reachable: boolean;
  model_available?: boolean;
  model?: string;
  error?: string;
  timestamp: string;
}

export interface ApiError extends Error {
  status?: number;
} 