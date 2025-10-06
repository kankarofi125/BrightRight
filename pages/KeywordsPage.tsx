

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { checkBrandVisibility } from '../services/geminiService';
import type { KeywordAnalysisResult, KeywordMentionDetail } from '../types';
import FloatingLabelInput from '../components/forms/FloatingLabelInput';

interface KeywordsPageProps {
    brandName: string;
    initialKeywords: string[];
}

const SENTIMENT_COLORS: { [key: string]: string } = {
    Positive: '#22C55E', // green-500
    Negative: '#EF4444', // red-500
    Neutral: '#FBBF24', // amber-400
    Mixed: '#6366F1', // brand-purple
};

const MENTION_BORDER_COLORS: { [key: string]: string } = {
    Positive: 'border-green-500',
    Negative: 'border-red-500',
    Neutral: 'border-yellow-500',
    Unknown: 'border-gray-500',
};

const SentimentIcon: React.FC<{ sentiment: KeywordMentionDetail['sentiment'] }> = ({ sentiment }) => {
    const baseClasses = "w-6 h-6 rounded-full flex items-center justify-center";
    switch (sentiment) {
        case 'Positive':
            return <div className={`${baseClasses} bg-green-500/20 text-green-400`}><IconThumbUp /></div>;
        case 'Negative':
            return <div className={`${baseClasses} bg-red-500/20 text-red-400`}><IconThumbDown /></div>;
        case 'Neutral':
            return <div className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}><IconMinus /></div>;
        default:
            return <div className={`${baseClasses} bg-gray-500/20 text-gray-400`}><IconQuestion /></div>;
    }
};

const KeywordsPage: React.FC<KeywordsPageProps> = ({ brandName, initialKeywords }) => {
    const [keywords, setKeywords] = useState<string[]>(initialKeywords);
    const [newKeyword, setNewKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<KeywordAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setKeywords(initialKeywords);
    }, [initialKeywords]);
    
    const handleAddKeyword = () => {
        if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            setKeywords([...keywords, newKeyword.trim()]);
            setNewKeyword('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddKeyword();
      }
    }

    const handleRemoveKeyword = (keywordToRemove: string) => {
        setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
    };
    
    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        if (keywords.length === 0) {
            setError("Please add at least one keyword to analyze.");
            setIsLoading(false);
            return;
        }

        const result = await checkBrandVisibility(brandName, keywords);

        if (result) {
            setAnalysisResult(result);
        } else {
            setError("Failed to get analysis from Gemini API. Please check the console for more details.");
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Keyword Tracking</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Manage Keywords</h2>
                    <div className="flex gap-2 mb-4">
                        <FloatingLabelInput
                            id="newKeyword"
                            label="Add a new keyword"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-grow"
                        />
                        <Button onClick={handleAddKeyword} disabled={!newKeyword.trim()}>Add</Button>
                    </div>
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                        {keywords.map(keyword => (
                            <li key={keyword} className="flex justify-between items-center bg-gray-500/10 p-2 rounded-md">
                                <span>{keyword}</span>
                                <button onClick={() => handleRemoveKeyword(keyword)} className="p-1 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                                    <IconTrash />
                                </button>
                            </li>
                        ))}
                         {keywords.length === 0 && <p className="text-gray-500 text-center py-4">No keywords added yet.</p>}
                    </ul>
                </Card>
                
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Visibility Analysis</h2>
                    <Button onClick={handleAnalyze} disabled={isLoading || keywords.length === 0} className="w-full">
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <IconSpinner />
                                <span className="ml-2">Analyzing...</span>
                            </div>
                        ) : `Analyze ${keywords.length} Keywords`}
                    </Button>

                    <div className="mt-4 space-y-4">
                        {error && <p className="text-red-400 bg-red-500/10 p-3 rounded-md">{error}</p>}
                        
                        {(() => {
                            if (isLoading) {
                                return <AnalysisPlaceholder />;
                            }
                            if (analysisResult) {
                                return (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-gray-500/10 rounded-lg flex flex-col justify-center">
                                                <p className="text-sm text-gray-400">Visibility Score</p>
                                                <p className="text-5xl font-bold text-brand-purple">{analysisResult.score}</p>
                                            </div>
                                            <div className="text-center p-4 bg-gray-500/10 rounded-lg flex flex-col justify-center">
                                                <p className="text-sm text-gray-400">Overall Sentiment</p>
                                                <p className="text-3xl font-bold" style={{ color: SENTIMENT_COLORS[analysisResult.sentiment] || '#FFFFFF' }}>{analysisResult.sentiment}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 bg-gray-500/10 rounded-lg">
                                            <p className="font-semibold mb-2">Summary</p>
                                            <p className="text-gray-400 text-sm">{analysisResult.summary}</p>
                                        </div>
                                        <div className="p-4 bg-gray-500/10 rounded-lg">
                                            <p className="font-semibold mb-3">Key Mentions</p>
                                            {analysisResult.mentions.length > 0 ? (
                                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                    {analysisResult.mentions.map((mention, i) => (
                                                        <div key={i} className={`group relative flex items-start gap-3 p-3 bg-black/20 rounded-md border-l-4 ${MENTION_BORDER_COLORS[mention.sentiment]}`}>
                                                            <div className="flex-shrink-0 pt-0.5">
                                                                <SentimentIcon sentiment={mention.sentiment} />
                                                            </div>
                                                            <p className="min-w-0 text-gray-300 text-sm truncate">{mention.text}</p>
                                                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-normal break-words z-10">
                                                                {mention.text}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                             ) : (
                                                <p className="text-gray-500 text-center py-2 text-sm">No specific mentions found in the analysis.</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                            if (!error) {
                                return (
                                    <div className="text-center text-gray-500 py-10 min-h-[200px] flex items-center justify-center">
                                        <p>Click "Analyze" to see your brand's visibility report from Gemini.</p>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const AnalysisPlaceholder: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="grid grid-cols-2 gap-4">
      <div className="h-28 bg-gray-500/20 rounded-lg"></div>
      <div className="h-28 bg-gray-500/20 rounded-lg"></div>
    </div>
    <div className="p-4 bg-gray-500/20 rounded-lg space-y-3">
        <div className="h-4 w-1/4 bg-gray-400/30 rounded"></div>
        <div className="h-3 w-full bg-gray-400/30 rounded mt-2"></div>
        <div className="h-3 w-3/4 bg-gray-400/30 rounded"></div>
    </div>
    <div className="p-4 bg-gray-500/20 rounded-lg space-y-3">
        <div className="h-4 w-1/3 bg-gray-400/30 rounded mb-4"></div>
        <div className="h-12 bg-gray-400/30 rounded"></div>
        <div className="h-12 bg-gray-400/30 rounded"></div>
        <div className="h-12 bg-gray-400/30 rounded"></div>
    </div>
  </div>
);


const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconSpinner = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const IconThumbUp = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.734V11a2 2 0 012-2h2V4a2 2 0 012-2v6z" /></svg>;
const IconThumbDown = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 5.266V13a2 2 0 01-2 2h-2v6a2 2 0 01-2 2v-6z" /></svg>;
const IconMinus = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>;
const IconQuestion = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default KeywordsPage;