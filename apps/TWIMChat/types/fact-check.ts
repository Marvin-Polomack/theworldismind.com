export interface FactCheckClaim {
  claim: string;
  is_factual: boolean | null;
  confidence: number;
  explanation: string;
  sources?: string[];
  sources_label?: string;
}

export interface FactCheckResult {
  original_message: string;
  claims: FactCheckClaim[];
  summary: string;
  contains_claims: boolean;
  error?: string;
  timestamp: string;
}

export interface FactCheckMessage extends FactCheckResult {
  id: number;
  room_id: string;
  message_id: number;  // References the original message
} 