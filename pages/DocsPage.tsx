
import React from 'react';
import Card from '../components/Card';

const DocsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Documentation</h1>
        <p className="text-gray-400 mt-2">Your guide to mastering BrightRank.</p>
      </div>

      <Card>
        <DocSection title="Getting Started">
            <p>Welcome to the BrightRank documentation. This guide will walk you through setting up your account and running your first analysis.</p>
            <h3 className="text-xl font-semibold mt-4 mb-2">1. Onboarding</h3>
            <p>When you first log in, you'll be prompted to enter your brand name and a list of keywords you want to track. These are crucial for the AI to understand what to look for.</p>
            <h3 className="text-xl font-semibold mt-4 mb-2">2. Your First Analysis</h3>
            <p>Once onboarding is complete, you'll land on the dashboard. Click the "Refresh Data" button to trigger your first visibility analysis. The results will populate the dashboard widgets.</p>
        </DocSection>

        <DocSection title="Core Features">
            <h3 className="text-xl font-semibold mt-4 mb-2">Dashboard</h3>
            <p>The dashboard provides a high-level overview of your AI visibility, including your overall score, sentiment breakdown, and recent mentions.</p>
            <h3 className="text-xl font-semibold mt-4 mb-2">Keyword Tracking</h3>
            <p>Dive deeper into specific terms. Add or remove keywords and run on-demand analyses to see how your visibility changes for different topics.</p>
            <h3 className="text-xl font-semibold mt-4 mb-2">Reports</h3>
            <p>Generate comprehensive reports that track your visibility and competitor performance over time. These can be exported as PDFs for sharing.</p>
        </DocSection>
      </Card>
    </div>
  );
};

interface DocSectionProps {
    title: string;
    children: React.ReactNode;
}

const DocSection: React.FC<DocSectionProps> = ({ title, children }) => (
    <div className="py-6 border-b border-border-color">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="prose prose-invert max-w-none">
            {children}
        </div>
    </div>
);

export default DocsPage;