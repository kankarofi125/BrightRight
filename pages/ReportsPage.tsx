import React, { useState, useCallback, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import FloatingLabelInput from '../components/forms/FloatingLabelInput';
import { getDashboardAnalysis, parseDashboardAnalysisResponse, checkBrandVisibility, parseAnalysisResponse } from '../services/geminiService';
import type { VisibilityData, CompetitorData, OnboardingData, Report, DashboardAnalysisResult, DetailedMention } from '../types';

// FIX: Renamed constant to use upper snake case for consistency.
const REPORTS_STORAGE_KEY = 'brightRankReports';

const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-gray-700/80 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm">
                <p className="label font-semibold">{`${label}`}</p>
                {payload.map((pld: any, index: number) => (
                    <div key={index} className="flex items-center" style={{ color: pld.color || pld.stroke }}>
                         <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: pld.color || pld.stroke }}></div>
                        {`${pld.name}: ${pld.value}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const generateTrendData = (currentScore: number, points = 7): VisibilityData[] => {
    const data: VisibilityData[] = [];
    const startScore = Math.max(10, Math.min(90, currentScore + (Math.random() - 0.6) * 40));
    for (let i = 0; i < points; i++) {
        const baseProgress = i / (points - 1);
        const baselineScore = startScore + (currentScore - startScore) * baseProgress;
        const fluctuationImpact = Math.sin(baseProgress * Math.PI);
        const fluctuation = (Math.random() - 0.5) * 15 * fluctuationImpact;
        let finalScore = Math.max(0, Math.min(100, baselineScore + fluctuation));
        const dateLabel = i === points - 1 ? 'Current' : `Week ${i + 1}`;
        data.push({ date: dateLabel, score: Math.round(finalScore) });
    }
    data[points - 1].score = currentScore;
    return data;
};

// --- Sub-components for Report View ---

const ReportHeader: React.FC<{ report: Report, brandName: string }> = ({ report, brandName }) => (
    <div className="mb-6 p-4 bg-gray-500/10 rounded-lg">
        <h2 className="text-3xl font-bold">{report.title}</h2>
        <div className="flex flex-wrap text-sm text-gray-400 mt-2 gap-x-6 gap-y-1">
            <span><strong>Brand:</strong> {brandName}</span>
            <span><strong>Date Range:</strong> {report.dateRange}</span>
            <span><strong>Generated:</strong> {report.dateGenerated}</span>
        </div>
    </div>
);

const KeyMetrics: React.FC<{ analysis: DashboardAnalysisResult }> = ({ analysis }) => {
    const SENTIMENT_COLORS = { positive: '#22C55E', neutral: '#FBBF24', negative: '#EF4444' };
    const chartData = [
        { name: 'Positive', value: analysis.sentimentBreakdown.positive },
        { name: 'Neutral', value: analysis.sentimentBreakdown.neutral },
        { name: 'Negative', value: analysis.sentimentBreakdown.negative },
    ];
    return (
        <Card className="card-for-print">
            <h3 className="text-xl font-semibold mb-4">Executive Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-gray-500/10 rounded-lg">
                    <p className="text-sm text-gray-400">Visibility Score</p>
                    <p className="text-5xl font-bold text-brand-purple">{analysis.overallScore}</p>
                </div>
                <div className="p-4 bg-gray-500/10 rounded-lg">
                    <p className="text-sm text-gray-400">Total Mentions</p>
                    <p className="text-5xl font-bold">{analysis.totalMentions}</p>
                </div>
                <div className="p-4 bg-gray-500/10 rounded-lg">
                     <p className="text-sm text-gray-400 mb-2">Sentiment Breakdown</p>
                     <div className="h-20">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={35} paddingAngle={3}>
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name.toLowerCase() as keyof typeof SENTIMENT_COLORS]} />)}
                                </Pie>
                                <Tooltip content={<ChartTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>
        </Card>
    );
};

const ReportChartCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <Card className="card-for-print">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="h-80">{children}</div>
    </Card>
);

const MentionsTable: React.FC<{ mentions: DashboardAnalysisResult['mentions'] }> = ({ mentions }) => (
    <Card className="card-for-print">
        <h3 className="text-xl font-semibold mb-4">Detailed Mentions</h3>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-gray-400">
                    <tr>
                        <th className="p-2 font-medium">Platform</th>
                        <th className="p-2 font-medium">Snippet</th>
                        <th className="p-2 font-medium">Sentiment</th>
                        <th className="p-2 font-medium">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {mentions.map((mention, index) => (
                        <tr key={index} className="border-b border-white/10">
                            <td className="p-2">{mention.platform}</td>
                            <td className="p-2 max-w-sm truncate">{mention.snippet}</td>
                            <td className="p-2">{mention.sentiment}</td>
                            <td className="p-2">{mention.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);


// --- Main Views ---

const ReportDetailView: React.FC<{ report: Report, brandName: string }> = ({ report, brandName }) => {
    return (
        <div id="print-area" className="space-y-6">
            <ReportHeader report={report} brandName={brandName} />
            <KeyMetrics analysis={report.analysis} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <ReportChartCard title="Visibility Trend">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={report.visibilityTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="date" stroke="currentColor" />
                            <YAxis stroke="currentColor" domain={[0, 100]} />
                            <Tooltip content={<ChartTooltip />} />
                            <Line type="monotone" name="Visibility Score" dataKey="score" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </ReportChartCard>
                 <ReportChartCard title="Sentiment Trend">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={report.analysis.sentimentTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="date" stroke="currentColor" />
                            <YAxis stroke="currentColor" domain={[0, 100]} unit="%" />
                            <Tooltip content={<ChartTooltip />} />
                            <Line type="monotone" name="Positive" dataKey="positive" stroke="#22C55E" strokeWidth={2} />
                            <Line type="monotone" name="Neutral" dataKey="neutral" stroke="#FBBF24" strokeWidth={2} />
                            <Line type="monotone" name="Negative" dataKey="negative" stroke="#EF4444" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </ReportChartCard>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReportChartCard title="Competitor Insights">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={report.competitorComparison} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" stroke="currentColor" />
                            <YAxis stroke="currentColor" domain={[0, 100]} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="visibility" name="Visibility" radius={[4, 4, 0, 0]}>
                                {report.competitorComparison.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === brandName ? '#EC4899' : '#6366F1'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ReportChartCard>
                <ReportChartCard title="Platform Breakdown">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={report.analysis.platformBreakdown} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="platform" stroke="currentColor" />
                            <YAxis stroke="currentColor" />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="mentions" name="Mentions" fill="#EC4899" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ReportChartCard>
            </div>
            <MentionsTable mentions={report.analysis.mentions} />
        </div>
    );
};

const CreateReportForm: React.FC<{
    onSubmit: (data: { title: string, dateRange: string }) => void;
    onCancel: () => void;
    isLoading: boolean;
}> = ({ onSubmit, onCancel, isLoading }) => {
    const [title, setTitle] = useState('');
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const dateRanges = ['Last 7 Days', 'Last 30 Days', 'This Month', 'Last 3 Months'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSubmit({ title, dateRange });
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold">Create New Report</h2>
                <FloatingLabelInput id="reportTitle" label="Report Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <div>
                    <label htmlFor="dateRange" className="block text-sm font-medium text-gray-400 mb-2">Select Date Range</label>
                    <div className="relative">
                        <select 
                            id="dateRange" 
                            value={dateRange} 
                            onChange={e => setDateRange(e.target.value)} 
                            className="w-full p-3 bg-gray-500/5 rounded-lg border border-gray-500/30 text-gray-900 dark:text-white focus:outline-none focus:ring-0 focus:border-brand-purple transition-colors duration-300 appearance-none pr-10"
                        >
                            {dateRanges.map(range => <option key={range} value={range} className="dark:bg-dark-bg">{range}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                            <IconChevronDown />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" disabled={isLoading || !title.trim()}>
                        {isLoading ? 'Generating...' : 'Generate Report'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};


const ReportSelector: React.FC<{
    reports: Report[];
    selectedReportId: string;
    onSelectReport: (reportId: string) => void;
}> = ({ reports, selectedReportId, onSelectReport }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selectedReport = reports.find(r => r.id === selectedReportId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    if (!selectedReport) return null;

    const sortedReports = [...reports].reverse();

    return (
        <div className="relative w-full" ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center w-full justify-between space-x-2 px-3 py-2 bg-gray-500/10 rounded-md hover:bg-gray-500/20 transition-colors text-left">
                <div className="flex items-center min-w-0">
                    <IconDocument />
                    <span className="ml-2 truncate">{selectedReport.title}</span>
                </div>
                <IconChevronDown className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-full min-w-[250px] bg-light-card dark:bg-dark-card backdrop-blur-lg shadow-glass border border-white/10 rounded-md z-10 animate-fade-in">
                    <ul className="p-1 max-h-60 overflow-y-auto">
                        {sortedReports.map(report => (
                            <li key={report.id} onClick={() => { onSelectReport(report.id); setIsOpen(false); }} className="px-3 py-2 text-sm rounded-md hover:bg-gray-500/10 cursor-pointer">
                                <p className="font-medium truncate">{report.title}</p>
                                <p className="text-xs text-gray-400">{report.dateGenerated} - {report.dateRange}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// --- Main Page Component ---

const ReportsPage: React.FC<{ appData: OnboardingData }> = ({ appData }) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

     useEffect(() => {
        try {
            const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
            if (storedReports) {
                setReports(JSON.parse(storedReports));
            }
        } catch (e) {
            console.error("Failed to load reports from localStorage", e);
        }
    }, []);

    const saveReports = (newReports: Report[]) => {
        setReports(newReports);
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(newReports));
    };

    const handleCreateReport = useCallback(async ({ title, dateRange }: { title: string, dateRange: string }) => {
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
                // Fetch competitor scores
                const competitorPromises = (appData.competitors || []).map(async (competitor) => {
                    try {
                        const competitorResponse = await checkBrandVisibility(competitor.name, keywordsArray);
                        if (competitorResponse) {
                            const competitorAnalysis = parseAnalysisResponse(competitorResponse.text);
                            return { name: competitor.name, visibility: competitorAnalysis.score };
                        }
                        return { name: competitor.name, visibility: competitor.visibility }; // Fallback
                    } catch (error) {
                        console.error(`Failed to analyze competitor ${competitor.name}:`, error);
                        return { name: competitor.name, visibility: competitor.visibility }; // Fallback on error
                    }
                });

                const competitorScores = await Promise.all(competitorPromises);

                const newReport: Report = {
                    id: `rep_${Date.now()}`,
                    title,
                    dateRange,
                    dateGenerated: new Date().toLocaleDateString(),
                    analysis: result,
                    visibilityTrend: generateTrendData(result.overallScore),
                    competitorComparison: [
                        { name: appData.brandName, visibility: result.overallScore }, 
                        ...competitorScores
                    ],
                };
                saveReports([...reports, newReport]);
                setSelectedReport(newReport);
                setIsCreating(false);
            } else {
                setError("Failed to parse report data from Gemini API.");
            }
        } else {
            setError("Failed to generate report from Gemini API. Please try again.");
        }
        setIsLoading(false);
    }, [appData, reports]);
    
    const handleDownloadPdf = () => {
        window.print();
    };

    const handleExportCsv = () => {
        if (!selectedReport) return;

        const mentions = selectedReport.analysis.mentions;
        const headers = ["Platform", "Snippet", "Sentiment", "Date"];

        const escapeCsvField = (field: string | undefined | null): string => {
            if (field === null || field === undefined) {
                return '""';
            }
            const str = String(field);
            // If the field contains a comma, a double quote, or a newline, wrap it in double quotes.
            const needsQuotes = str.includes(',') || str.includes('"') || str.includes('\n');
            if (needsQuotes) {
                // Escape existing double quotes by doubling them.
                const escapedStr = str.replace(/"/g, '""');
                return `"${escapedStr}"`;
            }
            return `"${str}"`; // Safer to quote all fields
        };

        const csvContent = [
            headers.join(','),
            ...mentions.map((mention: DetailedMention) => [
                escapeCsvField(mention.platform),
                escapeCsvField(mention.snippet),
                escapeCsvField(mention.sentiment),
                escapeCsvField(mention.date)
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        const filename = `${selectedReport.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_mentions.csv`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleSelectReport = (reportId: string) => {
        const newSelectedReport = reports.find(r => r.id === reportId);
        if (newSelectedReport) {
            setSelectedReport(newSelectedReport);
        }
    };

    const renderContent = () => {
        if (selectedReport) {
            return (
                 <div className="animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 no-print gap-3">
                        <Button variant="secondary" onClick={() => setSelectedReport(null)} className="w-full sm:w-auto">
                           <IconArrowLeft /> 
                           <span className="ml-2">Back to Reports</span>
                        </Button>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <ReportSelector
                                reports={reports}
                                selectedReportId={selectedReport.id}
                                onSelectReport={handleSelectReport}
                            />
                            <Button onClick={handleExportCsv} variant="secondary" className="whitespace-nowrap">
                                <IconExport />
                                <span className="hidden sm:inline ml-2">Export CSV</span>
                            </Button>
                            <Button onClick={handleDownloadPdf} className="whitespace-nowrap">
                                <IconDownload />
                                <span className="hidden sm:inline ml-2">Download PDF</span>
                            </Button>
                        </div>
                    </div>
                    <ReportDetailView report={selectedReport} brandName={appData.brandName} />
                </div>
            )
        }
        
        if(isCreating) {
            return <CreateReportForm onSubmit={handleCreateReport} onCancel={() => setIsCreating(false)} isLoading={isLoading} />
        }

        return (
            <div className="space-y-6">
                 {error && <Card className="text-center py-4 bg-red-500/10 text-red-400">{error}</Card>}
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Generated Reports</h2>
                        <Button onClick={() => setIsCreating(true)}><IconPlus /> Create New Report</Button>
                    </div>
                    {reports.length > 0 ? (
                        <ul className="space-y-3">
                            {reports.map(report => (
                                <li key={report.id} onClick={() => setSelectedReport(report)} className="flex justify-between items-center p-4 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 cursor-pointer transition-colors">
                                    <div>
                                        <p className="font-semibold">{report.title}</p>
                                        <p className="text-sm text-gray-400">Generated: {report.dateGenerated} | Range: {report.dateRange}</p>
                                    </div>
                                    <IconChevronRight />
                                </li>
                            )).reverse()}
                        </ul>
                    ) : (
                         <div className="text-center py-12">
                            <h3 className="text-xl font-semibold mb-2">No reports yet</h3>
                            <p className="text-gray-400 mb-6">Create your first report to start analyzing trends.</p>
                            <Button onClick={() => setIsCreating(true)}>Create Your First Report</Button>
                        </div>
                    )}
                </Card>
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reports</h1>
            {renderContent()}
        </div>
    );
};

const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const IconArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const IconDownload = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const IconExport = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const IconChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const IconDocument = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconChevronDown = ({ className = '' }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;


export default ReportsPage;