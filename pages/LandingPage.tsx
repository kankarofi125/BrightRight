
import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import type { Page } from '../types';

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <>
            {/* Hero Section */}
            <section className="h-screen flex items-center justify-center text-center relative overflow-hidden">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-full blur-3xl opacity-10"></div>
                <div className="relative z-10 max-w-4xl px-6">
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 leading-tight">
                        Track Your Brand's Visibility in AI Search
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-400">
                        Measure your brand's presence in AI-generated answers from Gemini, ChatGPT, and more. Master the new SEO for the AI era.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button onClick={onGetStarted} variant="primary" className="text-lg px-8 py-3 w-full sm:w-auto">Get Started for Free</Button>
                    </div>
                </div>
            </section>

             {/* Introduction Section */}
            <section className="py-20 container mx-auto px-6">
                 <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold">The Shift to Conversational Search</h2>
                    <p className="text-lg text-gray-400 mt-4">AI is the new search engine. If you're not in the answers, you don't exist.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <InfoCard title="AI Visibility is the new SEO" description="The future of search is shifting from traditional search engines to AI-powered assistants that provide direct answers." />
                    <InfoCard title="Brands are Losing Visibility" description="Companies are becoming invisible in AI search results, missing critical touchpoints with potential customers." />
                    <InfoCard title="Measurement Crisis" description="CMOs can't measure AI visibility, making it impossible to optimize strategies or justify marketing spend." />
                </div>
            </section>

             {/* Solution Section */}
            <section className="py-20 bg-gray-900/50">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                         <img src="https://storage.googleapis.com/awe-static-content/project-assets/brightrank-dashboard.png" alt="BrightRank Dashboard" className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold mb-8">The All-in-One AI Visibility Platform</h2>
                        <ul className="space-y-6">
                            <SolutionItem number="01" title="Measure AI Mentions" description="Track how often and where your brand appears in AI assistant responses across different platforms and queries." />
                            <SolutionItem number="02" title="Score Brand Visibility" description="Calculate a comprehensive visibility score that quantifies your brand's presence in the AI ecosystem." />
                            <SolutionItem number="03" title="Recommend Actions" description="Provide specific, actionable strategies to improve your brand's visibility in AI search results." />
                             <SolutionItem number="04" title="Report Progress" description="Generate detailed reports showing improvement over time and ROI of AI visibility efforts." />
                        </ul>
                    </div>
                </div>
            </section>

             {/* Features Section */}
             <section className="py-20 container mx-auto px-6">
                 <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold">Powerful Features</h2>
                    <p className="text-lg text-gray-400 mt-4">Everything you need to dominate AI-powered search.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                   <FeatureCard title="Mentions Tracker" description="Real-time monitoring of brand mentions across AI platforms with detailed context and sentiment analysis." />
                   <FeatureCard title="Competitor Analysis" description="Compare your AI visibility against competitors to identify opportunities and benchmark performance." />
                   <FeatureCard title="Visibility Score" description="Proprietary algorithm calculates a comprehensive visibility score based on mention frequency and quality." />
                   <FeatureCard title="Exportable Reports" description="Professional PDF reports perfect for executive presentations and client deliverables." />
                </div>
             </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8">
                <div className="container mx-auto px-6 text-center text-gray-500">
                    &copy; {new Date().getFullYear()} BrightRank. All rights reserved.
                </div>
            </footer>
        </>
    );
};


const InfoCard: React.FC<{title: string; description: string}> = ({ title, description }) => (
    <Card className="text-left h-full">
        <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </Card>
);

const SolutionItem: React.FC<{number: string; title: string; description: string}> = ({number, title, description}) => (
    <li className="flex items-start">
        <div className="text-2xl font-bold text-brand-purple mr-6">{number}</div>
        <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-gray-400 mt-1">{description}</p>
        </div>
    </li>
);

const FeatureCard: React.FC<{title: string; description: string}> = ({ title, description }) => (
    <Card className="hover:border-brand-purple transition-colors h-full">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </Card>
);

export default LandingPage;
