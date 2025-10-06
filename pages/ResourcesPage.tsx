
import React, { useState } from 'react';
import Card from '../components/Card';

const ResourcesPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Resources</h1>
        <p className="text-gray-400 mt-2">Find answers and guides to help you get the most out of BrightRank.</p>
      </div>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <FAQItem
            question="What is AI Visibility?"
            answer="AI Visibility refers to how often and how prominently your brand appears in the answers provided by generative AI models like Gemini, ChatGPT, and Claude. It's the new SEO for the conversational search era."
          />
          <FAQItem
            question="How is the Visibility Score calculated?"
            answer="Our proprietary algorithm analyzes several factors, including the frequency of mentions, the sentiment of the context, the authority of the source (when available), and the relevance of the user query to your brand's keywords."
          />
          <FAQItem
            question="Which AI platforms do you track?"
            answer="We currently track mentions across Google Gemini, OpenAI's ChatGPT, and Anthropic's Claude. We are continuously working to add support for more platforms as they become relevant."
          />
          <FAQItem
            question="How often is the data refreshed?"
            answer="The data refresh frequency depends on your plan. The Starter plan includes weekly refreshes, the Business plan offers daily refreshes, and the Enterprise plan provides real-time monitoring capabilities."
          />
        </div>
      </Card>
    </div>
  );
};

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border-color">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left">
                <span className="font-semibold">{question}</span>
                <IconChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="pb-4 text-gray-400">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

const IconChevronDown: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;

export default ResourcesPage;