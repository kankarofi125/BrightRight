

export type Page = 'dashboard' | 'keywords' | 'reports' | 'settings' | 'pricing' | 'resources' | 'changelog' | 'docs' | 'landing';

export interface Mention {
    id: number;
    platform: 'Gemini' | 'ChatGPT' | 'Claude';
    query: string;
    snippet: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    date: string;
}

export interface SentimentData {
    name: string;
    value: number;
}

export interface VisibilityData {
    date: string;

    score: number;
}

export interface CompetitorData {
    name: string;
    visibility: number;
}

export interface OnboardingData {
    brandName: string;
    keywords: string;
    competitors: CompetitorData[];
}

export interface KeywordMentionDetail {
    text: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Unknown';
}

export interface KeywordAnalysisResult {
    summary: string;
    sentiment: string;
    score: number;
    mentions: KeywordMentionDetail[];
}

// New types for Dashboard
export interface DetailedMention {
    platform: string;
    query: string;
    snippet: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    date: string;
    confidence: number;
}

export interface SentimentBreakdown {
    positive: number;
    neutral: number;
    negative: number;
}

export interface SentimentTrendPoint {
    date: string;
    positive: number;
    neutral: number;
    negative: number;
}

export interface PlatformBreakdown {
    platform: string;
    mentions: number;
}

export interface ActionableInsight {
    category: 'Content Strategy' | 'Community Engagement' | 'Reputation Management' | 'SEO Optimization';
    priority: 'High' | 'Medium' | 'Low';
    title: string;
    description: string;
}

export interface DashboardAnalysisResult {
    overallScore: number;
    visibilityChange: number;
    totalMentions: number;
    sentimentBreakdown: SentimentBreakdown;
    mentions: DetailedMention[];
    sentimentTrend: SentimentTrendPoint[];
    platformBreakdown: PlatformBreakdown[];
    actionableInsights?: ActionableInsight[];
}

export interface Report {
  id: string;
  title: string;
  dateGenerated: string;
  dateRange: string;
  analysis: DashboardAnalysisResult;
  competitorComparison: CompetitorData[];
  visibilityTrend: VisibilityData[];
}