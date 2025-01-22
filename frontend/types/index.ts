export interface Lead {
  name: string;
  'email ': string;
  'phone ': string;
  'company ': string;
  'message ': string;
  source: string;
}

export interface LeadAnalysis {
  score: number;
  category: 'HOT' | 'WARM' | 'COLD';
  reason: string;
  action: string;
  full_analysis?: string;
}

export interface ScoreCardProps {
  title: string;
  count: number;
  category: 'hot' | 'warm' | 'cold';
} 