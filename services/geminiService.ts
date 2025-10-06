import type { KeywordAnalysisResult, DashboardAnalysisResult, ActionableInsight, CompetitorData } from '../types';

// Helper function to create a random number in a range
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const mockActionableInsights: { insights: ActionableInsight[] } = {
    insights: [
        { category: 'Reputation Management', priority: 'High', title: 'Address Negative Subscription Feedback', description: 'Create a dedicated FAQ page and train support staff to handle complaints promptly about delivery delays.' },
        { category: 'Content Strategy', priority: 'Medium', title: 'Leverage "Eco-Friendly" Keywords', description: 'Create blog content and social media campaigns highlighting your brand\'s eco-friendly practices and compostable pods.' },
        { category: 'SEO Optimization', priority: 'Low', title: 'Create Comparison Content', description: 'Develop a "Why [BrandName] is the best choice" page to control the narrative against competitors mentioned in taste tests.' }
    ]
};

// --- Dynamic Data Generators ---

const generateDynamicDashboardData = (brandName: string, keywords: string[], dateRange: string): DashboardAnalysisResult => {
    const totalMentions = random(50, 250);
    const positive = random(30, 70);
    const neutral = random(10, 30);
    const negative = 100 - positive - neutral;

    const platforms = ['Gemini', 'ChatGPT', 'Claude'];
    const sentiments: ('Positive' | 'Negative' | 'Neutral')[] = ['Positive', 'Negative', 'Neutral'];

    const brandHash = brandName.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const overallScore = (Math.abs(brandHash) % 40) + 50; // Score between 50-90

    return {
        overallScore: overallScore,
        visibilityChange: parseFloat((Math.random() * 20 - 10).toFixed(1)), // -10% to +10%
        totalMentions: totalMentions,
        sentimentBreakdown: { positive, neutral, negative },
        mentions: Array.from({ length: 5 }, (_, i) => ({
            platform: platforms[random(0, platforms.length - 1)],
            query: `reviews for ${brandName} ${keywords[random(0, keywords.length - 1)] || 'products'}`,
            snippet: `A user mentioned ${brandName} in a discussion about ${keywords[random(0, keywords.length - 1)] || 'its products'}. The sentiment was generally ${sentiments[random(0, 2)].toLowerCase()}.`,
            sentiment: sentiments[random(0, 2)],
            date: `2023-10-${random(20, 28)}`,
            confidence: parseFloat((Math.random() * 0.15 + 0.85).toFixed(2)), // 0.85 - 1.0
        })),
        sentimentTrend: [
            { date: 'Week 1', positive: Math.max(0, positive - random(10,15)), neutral: neutral + random(0,5), negative: 100 - (positive - random(10,15)) - (neutral + random(0,5))},
            { date: 'Week 2', positive: Math.max(0, positive - random(5,10)), neutral: neutral + random(0,5), negative: 100 - (positive - random(5,10)) - (neutral + random(0,5))},
            { date: 'Week 3', positive: Math.max(0, positive - random(0,5)), neutral: neutral - random(0,5), negative: 100 - (positive - random(0,5)) - (neutral - random(0,5))},
            { date: 'Week 4', positive: positive, neutral: neutral, negative: negative },
        ].map(d => ({...d, positive: Math.max(0, Math.min(100, d.positive)), neutral: Math.max(0, Math.min(100, d.neutral)), negative: Math.max(0, Math.min(100, d.negative)) })),
        platformBreakdown: [
            { platform: 'ChatGPT', mentions: Math.floor(totalMentions * 0.5) },
            { platform: 'Gemini', mentions: Math.floor(totalMentions * 0.35) },
            { platform: 'Claude', mentions: Math.floor(totalMentions * 0.15) },
        ],
    };
};

const generateDynamicKeywordAnalysis = (brandName: string, keywords: string[]): KeywordAnalysisResult => {
    const brandHash = brandName.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const score = (Math.abs(brandHash) % 40) + 55; // Score between 55-95
    const sentiments: ('Positive' | 'Negative' | 'Neutral' | 'Unknown')[] = ['Positive', 'Negative', 'Neutral', 'Unknown'];
    const sentimentSummary = ['Mixed', 'Positive', 'Neutral'][random(0,2)];

    return {
        summary: `Analysis for "${brandName}" shows a strong presence for keywords like "${keywords[0]}". Overall sentiment is ${sentimentSummary.toLowerCase()}, though some discussions mention price or customer support as areas for improvement.`,
        sentiment: sentimentSummary,
        score: score,
        mentions: keywords.slice(0, 4).map(kw => ({
            text: `Users associate ${brandName} with "${kw}" in a generally ${sentiments[random(0, 2)].toLowerCase()} way.`,
            sentiment: sentiments[random(0, 3)],
        })),
    };
};

// --- Mock Service Functions ---

const simulateApiCall = <T>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data);
        }, 500 + Math.random() * 500); // Simulate network delay
    });
};

export const checkBrandVisibility = async (brandName: string, keywords: string[]): Promise<KeywordAnalysisResult | null> => {
  console.log("MOCK: checkBrandVisibility called with:", { brandName, keywords });
  const result = generateDynamicKeywordAnalysis(brandName, keywords);
  return simulateApiCall(result);
};

export const getDashboardAnalysis = async (brandName: string, keywords: string[], dateRange: string): Promise<DashboardAnalysisResult | null> => {
    console.log("MOCK: getDashboardAnalysis called with:", { brandName, keywords, dateRange });
    const result = generateDynamicDashboardData(brandName, keywords, dateRange);
    return simulateApiCall(result);
};

export const getActionableInsights = async (analysisResult: DashboardAnalysisResult): Promise<{ insights: ActionableInsight[] } | null> => {
    console.log("MOCK: getActionableInsights called.");
    // Actionable insights can remain static as they are high-quality examples.
    // We can still replace the placeholder for a bit more dynamic feel.
    const dynamicInsights = JSON.parse(JSON.stringify(mockActionableInsights).replace(/\[BrandName\]/g, analysisResult.mentions[0]?.snippet.includes('BrandName') ? 'Your Brand' : 'a competitor'));
    return simulateApiCall(dynamicInsights);
};

export const getCompetitorScores = async (mainBrandName: string, keywords: string[], competitorNames: string[]): Promise<CompetitorData[] | null> => {
    console.log("MOCK: getCompetitorScores called with:", { mainBrandName, keywords, competitorNames });
    const mockScores: CompetitorData[] = competitorNames.map(name => ({
        name,
        visibility: Math.floor(40 + Math.random() * 50) // Random score between 40 and 90
    }));
    return simulateApiCall(mockScores);
};
