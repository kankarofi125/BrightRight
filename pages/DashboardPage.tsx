import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import { getDashboardAnalysis, parseDashboardAnalysisResponse } from '../services/geminiService';
import type { OnboardingData, DashboardAnalysisResult, DetailedMention, SentimentBreakdown, SentimentTrendPoint, PlatformBreakdown } from '../types';

const DateSelector: React.FC<{
  selectedRange: string;
  onSelectRange: (range: string) => void;
}> = ({ selectedRange, onSelectRange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ranges = ['Last 7 Days', 'Last 30 Days', 'This Month', 'Last 3 Months'];
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 px-3 py-1.5 bg-gray-500/10 rounded-md hover:bg-gray-500/20 transition-colors">
                <IconCalendar />
                <span>{selectedRange}</span>
                <IconChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-light-card dark:bg-dark-card backdrop-blur-lg shadow-glass border border-white/10 rounded-md z-10 animate-fade-in">
                    <ul className="p-1">
                        {ranges.map(range => (
                            <li key={range} onClick={() => { onSelectRange(range); setIsOpen(false); }} className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-500/10 cursor-pointer">
                                {range}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-gray-800/80 backdrop-blur-sm border border-white/20 rounded-lg text-white shadow-lg text-sm">
                <p className="font-semibold mb-1">{label}</p>
                 {payload.map((pld: any, index: number) => (
                    <div key={index} className="flex items-center" style={{ color: pld.color || pld.stroke }}>
                        <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: pld.color || pld.stroke }}></div>
                        <span className="capitalize">{pld.name}:</span>
                        <span className="ml-2">{pld.value}{pld.dataKey.includes('positive') || pld.dataKey.includes('negative') ? '%' : ''}</span>
                    </div>
                 ))}
            </div>
        );
    }
    return null;
};

const VisibilityScoreCard: React.FC<{ score: number; change: number }> = ({ score, change }) => {
    const circumference = 2 * Math.PI * 44;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const changeColor = change >= 0 ? 'text-green-400' : 'text-red-400';
    const ChangeIcon = change >= 0 ? IconTrendingUp : IconTrendingDown;

    return (
        <Card className="flex flex-col items-center justify-center text-center h-full">
             <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Visibility Score</h3>
            <div className="relative w-36 h-36">
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
                    <circle
                        cx="50" cy="50" r="44" fill="none"
                        stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 50 50)" className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" className="text-brand-pink" stopColor="currentColor" />
                            <stop offset="100%" className="text-brand-purple" stopColor="currentColor" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-4xl font-bold text-gray-900 dark:text-white">{score}</span>
                </div>
            </div>
             <div className={`flex items-center justify-center text-sm font-semibold mt-2 ${changeColor}`}>
                <ChangeIcon />
                <span>{change >= 0 ? '+' : ''}{change}% vs last period</span>
            </div>
        </Card>
    );
};

const TotalMentionsCard: React.FC<{ mentions: number }> = ({ mentions }) => (
    <Card className="flex flex-col items-center justify-center text-center h-full">
         <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Total Mentions</h3>
        <p className="text-6xl font-bold text-gray-900 dark:text-white">{mentions}</p>
        <p className="text-sm text-gray-400 mt-1">Across all tracked platforms</p>
    </Card>
);

const SENTIMENT_COLORS = { positive: '#22C55E', neutral: '#FBBF24', negative: '#EF4444' };

const SentimentChartCard: React.FC<{ data: SentimentBreakdown }> = ({ data }) => {
    const chartData = [
        { name: 'positive', value: data.positive },
        { name: 'neutral', value: data.neutral },
        { name: 'negative', value: data.negative },
    ];
    return (
        <Card className="flex flex-col items-center justify-center text-center h-full">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sentiment Breakdown</h3>
            <div className="w-full h-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={55} dataKey="value" stroke="none">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name as keyof typeof SENTIMENT_COLORS]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="text-center">
                         <p className="text-3xl font-bold">{data.positive}%</p>
                         <p className="text-sm text-gray-400">Positive</p>
                     </div>
                </div>
            </div>
        </Card>
    );
};

const SentimentTrendChart: React.FC<{ data: SentimentTrendPoint[] }> = ({ data }) => (
    <Card className="lg:col-span-2">
         <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sentiment Trend</h3>
         <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="date" stroke="currentColor" tick={{ fontSize: 12 }} />
                    <YAxis stroke="currentColor" tick={{ fontSize: 12 }} unit="%" domain={[0, 100]}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" name="Positive" dataKey="positive" stroke={SENTIMENT_COLORS.positive} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Neutral" dataKey="neutral" stroke={SENTIMENT_COLORS.neutral} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Negative" dataKey="negative" stroke={SENTIMENT_COLORS.negative} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
         </div>
    </Card>
);

const PlatformBreakdownChart: React.FC<{ data: PlatformBreakdown[] }> = ({ data }) => (
    <Card>
         <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Platform Breakdown</h3>
         <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis type="number" stroke="currentColor" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="platform" stroke="currentColor" width={60} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}/>
                    <Bar dataKey="mentions" name="Mentions" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
             </ResponsiveContainer>
         </div>
    </Card>
);


const MentionsTable: React.FC<{ mentions: DetailedMention[] }> = ({ mentions }) => {
    const SentimentIndicator: React.FC<{ sentiment: string }> = ({ sentiment }) => {
        const baseClasses = "flex items-center gap-2 whitespace-nowrap";
        switch (sentiment) {
            case 'Positive': return <div className={baseClasses}><div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div><span className="text-gray-300">Positive</span></div>;
            case 'Neutral': return <div className={baseClasses}><div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"></div><span className="text-gray-300">Neutral</span></div>;
            case 'Negative': return <div className={baseClasses}><div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div><span className="text-gray-300">Negative</span></div>;
            default: return <div className={baseClasses}><div className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0"></div><span className="text-gray-300">{sentiment}</span></div>;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-gray-400">
                    <tr>
                        <th className="p-3 font-medium">AI Platform</th>
                        <th className="p-3 font-medium">Query / Prompt</th>
                        <th className="p-3 font-medium">Response Snippet</th>
                        <th className="p-3 font-medium">Sentiment</th>
                        <th className="p-3 font-medium">Date</th>
                        <th className="p-3 font-medium text-right">Confidence</th>
                    </tr>
                </thead>
                <tbody>
                    {mentions.map((mention, index) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-gray-500/10 transition-colors">
                            <td className="p-3 whitespace-nowrap">{mention.platform}</td>
                            <td className="p-3 max-w-xs relative group">
                                <p className="truncate">{mention.query}</p>
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 whitespace-normal break-words">
                                    {mention.query}
                                </span>
                            </td>
                            <td className="p-3 max-w-sm relative group">
                                <p className="truncate">{mention.snippet}</p>
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 whitespace-normal break-words">
                                    {mention.snippet}
                                </span>
                            </td>
                            <td className="p-3"><SentimentIndicator sentiment={mention.sentiment} /></td>
                            <td className="p-3 whitespace-nowrap">{mention.date}</td>
                            <td className="p-3 text-right whitespace-nowrap">{(mention.confidence * 100).toFixed(0)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DashboardPlaceholder: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="h-48"><div className="w-full h-full bg-gray-500/20 rounded-lg"></div></Card>
        <Card className="h-48"><div className="w-full h-full bg-gray-500/20 rounded-lg"></div></Card>
        <Card className="h-48"><div className="w-full h-full bg-gray-500/20 rounded-lg"></div></Card>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-80"><div className="w-full h-full bg-gray-500/20 rounded-lg"></div></Card>
        <Card className="h-80"><div className="w-full h-full bg-gray-500/20 rounded-lg"></div></Card>
    </div>
    <Card>
        <div className="h-8 w-1/3 bg-gray-500/20 rounded mb-4"></div>
        <div className="space-y-2">
            <div className="h-10 bg-gray-500/20 rounded"></div>
            <div className="h-10 bg-gray-500/20 rounded"></div>
            <div className="h-10 bg-gray-500/20 rounded"></div>
        </div>
    </Card>
  </div>
);

interface DashboardPageProps {
  appData: OnboardingData | null;
  initialAnalysisResult: DashboardAnalysisResult | null;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ appData, initialAnalysisResult }) => {
    const [analysisResult, setAnalysisResult] = useState<DashboardAnalysisResult | null>(initialAnalysisResult);
    const [isLoading, setIsLoading] = useState(!initialAnalysisResult);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState('Last 7 Days');
    const isInitialMount = useRef(true);
    
    const runAnalysis = useCallback(async () => {
        if (!appData?.brandName || !appData?.keywords) {
            setError("Brand name and keywords are not set. Please configure them in Settings.");
            return;
        }
        setIsLoading(true);
        setError(null);
        
        const keywordsArray = appData.keywords.split(',').map(k => k.trim()).filter(Boolean);
        if (keywordsArray.length === 0) {
            setError("No keywords found. Please add some in Settings.");
            setIsLoading(false);
            return;
        }
        
        const response = await getDashboardAnalysis(appData.brandName, keywordsArray, dateRange);

        if (response) {
            const result = parseDashboardAnalysisResponse(response.text);
            if (result) {
                setAnalysisResult(result);
            } else {
                 setError("Failed to parse analysis from Gemini API. The response format was unexpected.");
            }
        } else {
            setError("Failed to get analysis from Gemini API. This might be a temporary network issue.");
        }
        setIsLoading(false);
    }, [appData, dateRange]);

    useEffect(() => {
        if (initialAnalysisResult) {
            setAnalysisResult(initialAnalysisResult);
            setIsLoading(false);
        } else if (appData) {
             setIsLoading(false);
        }
    }, [initialAnalysisResult, appData]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        runAnalysis();
    }, [dateRange, runAnalysis]);

    const handleRefresh = () => {
        runAnalysis();
    }
    
    const renderContent = () => {
        if (isLoading) return <DashboardPlaceholder />;
        if (error) return <Card className="text-center py-12"><p className="text-red-400 mb-4">{error}</p><Button onClick={handleRefresh}>Try Again</Button></Card>;
        if (!analysisResult) return <Card className="text-center py-12"><p className="text-gray-500 mb-4">Welcome! Click "Refresh Data" to generate your dashboard.</p><Button onClick={handleRefresh} disabled={isLoading}>{isLoading ? 'Analyzing...' : 'Refresh Data'}</Button></Card>;
        
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <VisibilityScoreCard score={analysisResult.overallScore} change={analysisResult.visibilityChange} />
                    <TotalMentionsCard mentions={analysisResult.totalMentions} />
                    <SentimentChartCard data={analysisResult.sentimentBreakdown} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <SentimentTrendChart data={analysisResult.sentimentTrend} />
                    <PlatformBreakdownChart data={analysisResult.platformBreakdown} />
                </div>
                 <Card className="lg:col-span-3">
                    <h2 className="text-xl font-semibold mb-4">📊 Mentions Tracker</h2>
                    <MentionsTable mentions={analysisResult.mentions} />
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                     <h1 className="text-3xl font-bold">Dashboard</h1>
                     <p className="text-gray-400">Full AI Visibility Breakdown for "{appData?.brandName}"</p>
                </div>
                 <div className="flex items-center gap-4">
                    <DateSelector selectedRange={dateRange} onSelectRange={setDateRange} />
                    <Button onClick={handleRefresh} disabled={isLoading}>
                        <IconRefresh />
                        <span className="ml-2 hidden sm:inline">{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
                    </Button>
                 </div>
            </div>
            {renderContent()}
        </div>
    );
};

const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 11A8.1 8.1 0 004.5 9M4 5v4h4m-4 4a8.1 8.1 0 0015.5 2m.5 4v-4h-4" /></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconChevronDown = ({ className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const IconTrendingUp = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>;
const IconTrendingDown = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" /></svg>;

export default DashboardPage;