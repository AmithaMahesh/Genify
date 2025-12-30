
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
  language?: string;
}

export interface Insight {
  title: string;
  description: string;
  tag: 'Funding' | 'Policy' | 'Investor';
}

export enum IndicLanguage {
  HINDI = 'Hindi (हिन्दी)',
  TAMIL = 'Tamil (தமிழ்)',
  TELUGU = 'Telugu (తెలుగు)',
  BENGALI = 'Bengali (বাংলা)',
  MARATHI = 'Marathi (मराठी)',
  GUJARATI = 'Gujarati (ગુજરાતી)',
  KANNADA = 'Kannada (ಕನ್ನಡ)',
  MALAYALAM = 'Malayalam (മലയാളം)',
  PUNJABI = 'Punjabi (ਪੰਜਾਬੀ)',
  ENGLISH = 'English'
}
