import { GoogleGenAI, Type } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import type { KeywordAnalysisResult, KeywordMentionDetail, DashboardAnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Checks brand visibility using the Gemini API with a structured prompt.
 * 
 * @param brandName The brand to search for.
 * @param keywords Keywords related to the brand's industry.
 * @returns A promise that resolves to a Gemini API response or null on error.
 */
export const checkBrandVisibility = async (brandName: string, keywords: string[]): Promise<GenerateContentResponse | null> => {
  const prompt = `
    Analyze the web for mentions of the brand "${brandName}" in the context of the following topics: ${keywords.join(', ')}.
    Please provide your analysis in the following format, using the exact headings:

    ## Summary
    A brief one-paragraph summary of the brand's visibility and general perception based on the keywords.

    ## Sentiment
    A single word describing the overall sentiment (e.g., Positive, Neutral, Negative, Mixed).

    ## Visibility Score
    A numerical score from 0 to 100 representing the brand's visibility for these keywords. 100 is highest visibility.

    ## Key Mentions
    A bulleted list of 3-5 key phrases or sentences where the brand was mentioned. For each mention, prefix it with its sentiment in square brackets, like [Positive], [Negative], or [Neutral].
    For example:
    - [Positive] BrightRank.AI is the best tool for AI visibility.
    - [Negative] The pricing for BrightRank.AI can be confusing.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};

export const parseAnalysisResponse = (text: string): KeywordAnalysisResult => {
    const summaryMatch = text.match(/## Summary\s*([\s\S]*?)(?=\n##|$)/);
    const sentimentMatch = text.match(/## Sentiment\s*([\s\S]*?)(?=\n##|$)/);
    const scoreMatch = text.match(/## Visibility Score\s*(\d+)/);
    const mentionsMatch = text.match(/## Key Mentions\s*([\s\S]*)/);
    
    const mentions: KeywordMentionDetail[] = [];
    if (mentionsMatch && mentionsMatch[1]) {
        const mentionLines = mentionsMatch[1].split('\n').map(m => m.trim()).filter(Boolean);
        mentionLines.forEach(line => {
            const lineMatch = line.match(/^- \[(Positive|Negative|Neutral)\]\s*(.*)/i);
            if (lineMatch && lineMatch[2]) {
                mentions.push({
                    sentiment: lineMatch[1].charAt(0).toUpperCase() + lineMatch[1].slice(1).toLowerCase() as 'Positive' | 'Negative' | 'Neutral',
                    text: lineMatch[2].trim(),
                });
            } else if (line.startsWith('- ')) {
                mentions.push({
                    sentiment: 'Unknown',
                    text: line.substring(2).trim(),
                });
            }
        });
    }

    return {
        summary: summaryMatch ? summaryMatch[1].trim() : 'Could not parse summary.',
        sentiment: sentimentMatch ? sentimentMatch[1].trim() : 'N/A',
        score: scoreMatch ? parseInt(scoreMatch[1], 10) : 0,
        mentions: mentions
    };
};

export const getDashboardAnalysis = async (brandName: string, keywords: string[], dateRange: string): Promise<GenerateContentResponse | null> => {
    const prompt = `
    Analyze AI visibility for the brand "${brandName}" based on topics: ${keywords.join(', ')} for the period "${dateRange}".
    Provide a full breakdown in the following format, using the exact headings and structure. Do not use JSON. Ensure all values are filled.

    ## Overall Score
    A numerical score from 0 to 100.

    ## Visibility Change
    A percentage change from the previous period (e.g., 5.2 or -3.1).

    ## Total Mentions
    The total number of mentions found.

    ## Sentiment Breakdown
    A list of sentiment percentages:
    - Positive: [percentage]
    - Neutral: [percentage]
    - Negative: [percentage]

    ## Mentions
    A bulleted list of 5 to 10 detailed mentions. Each line must follow this exact format:
    - Platform: [AI Platform] | Query: [User Query] | Snippet: [Response Snippet] | Sentiment: [Positive/Negative/Neutral] | Date: [YYYY-MM-DD] | Confidence: [0.0-1.0]

    ## Sentiment Trend
    A bulleted list of 4-7 data points for sentiment percentages over time. Each line must follow this format:
    - Date: [Date Label] | Positive: [percentage] | Neutral: [percentage] | Negative: [percentage]

    ## Platform Breakdown
    A bulleted list of mention counts per platform. Each line must follow this format:
    - Platform: [Platform Name] | Mentions: [Count]
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response;
    } catch (error) {
        console.error("Error calling Gemini API for dashboard analysis:", error);
        return null;
    }
};

export const parseDashboardAnalysisResponse = (text: string): DashboardAnalysisResult | null => {
    try {
        const getSectionContent = (heading: string, content: string): string => {
            const regex = new RegExp(`## ${heading}\\s*([\\s\\S]*?)(?=\\n##|$)`, 'i');
            const match = content.match(regex);
            return match ? match[1].trim() : '';
        };

        const overallScore = parseInt(getSectionContent('Overall Score', text), 10) || 0;
        const visibilityChange = parseFloat(getSectionContent('Visibility Change', text)) || 0;
        const totalMentions = parseInt(getSectionContent('Total Mentions', text), 10) || 0;

        const sentimentBreakdownText = getSectionContent('Sentiment Breakdown', text);
        const sentimentBreakdown = {
            positive: parseInt(sentimentBreakdownText.match(/Positive:\s*(\d+)/)?.[1] || '0', 10),
            neutral: parseInt(sentimentBreakdownText.match(/Neutral:\s*(\d+)/)?.[1] || '0', 10),
            negative: parseInt(sentimentBreakdownText.match(/Negative:\s*(\d+)/)?.[1] || '0', 10),
        };

        const mentionsText = getSectionContent('Mentions', text);
        const mentionRegex = /- Platform: (.*?) \| Query: (.*?) \| Snippet: (.*?) \| Sentiment: (.*?) \| Date: (.*?) \| Confidence: (.*)/g;
        const mentions: any[] = [];
        let mentionMatch;
        while ((mentionMatch = mentionRegex.exec(mentionsText)) !== null) {
            mentions.push({
                platform: mentionMatch[1].trim(),
                query: mentionMatch[2].trim(),
                snippet: mentionMatch[3].trim(),
                sentiment: mentionMatch[4].trim(),
                date: mentionMatch[5].trim(),
                confidence: parseFloat(mentionMatch[6].trim()),
            });
        }
        
        const sentimentTrendText = getSectionContent('Sentiment Trend', text);
        const trendRegex = /- Date: (.*?) \| Positive: (.*?) \| Neutral: (.*?) \| Negative: (.*?)/g;
        const sentimentTrend: any[] = [];
        let trendMatch;
        while ((trendMatch = trendRegex.exec(sentimentTrendText)) !== null) {
            sentimentTrend.push({
                date: trendMatch[1].trim(),
                positive: parseInt(trendMatch[2].trim(), 10),
                neutral: parseInt(trendMatch[3].trim(), 10),
                negative: parseInt(trendMatch[4].trim(), 10),
            });
        }

        const platformBreakdownText = getSectionContent('Platform Breakdown', text);
        const platformRegex = /- Platform: (.*?) \| Mentions: (.*)/g;
        const platformBreakdown: any[] = [];
        let platformMatch;
        while ((platformMatch = platformRegex.exec(platformBreakdownText)) !== null) {
            platformBreakdown.push({
                platform: platformMatch[1].trim(),
                mentions: parseInt(platformMatch[2].trim(), 10),
            });
        }
        
        const result: DashboardAnalysisResult = {
            overallScore,
            visibilityChange,
            totalMentions,
            sentimentBreakdown,
            mentions,
            sentimentTrend,
            platformBreakdown,
        };

        if (result && typeof result.overallScore === 'number') {
            return result;
        }
        console.error("Parsed dashboard text is missing required fields:", result);
        return null;
    } catch (e) {
        console.error("Failed to parse dashboard text response:", e, "Raw text:", text);
        return null;
    }
};