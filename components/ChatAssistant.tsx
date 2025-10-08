import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getDashboardAnalysis, getChatResponseStream } from '../services/geminiService';
import type { OnboardingData, ChatMessage, DashboardAnalysisResult } from '../types';

const ChatAssistant: React.FC<{ appData: OnboardingData | null }> = ({ appData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            if (messages.length === 0) {
                 setMessages([{ role: 'model', content: "Hello! I'm your BrightRank AI assistant. Ask me anything about your current dashboard data." }]);
            }
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !appData) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Fetch fresh context for the AI
            const keywordsArray = appData.keywords.split(',').map(k => k.trim()).filter(Boolean);
            const context = await getDashboardAnalysis(appData.brandName, keywordsArray, 'Last 7 Days');

            if (!context) {
                throw new Error("Could not fetch dashboard data for context.");
            }
            
            // Add a placeholder for the model's response
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            const stream = getChatResponseStream(input, context);
            for await (const chunk of stream) {
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.role === 'model') {
                        lastMessage.content += chunk;
                        return [...prev];
                    }
                    return prev; // Should not happen
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage.role === 'model') {
                    lastMessage.content = "Sorry, I encountered an error. Please try again.";
                }
                return [...prev];
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <div className={`fixed bottom-24 right-4 sm:right-6 lg:right-8 w-[calc(100%-2rem)] max-w-md h-[70vh] max-h-[500px] z-40 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                <div className="flex flex-col h-full bg-light-card dark:bg-dark-card backdrop-blur-xl shadow-glass border border-white/10 rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-purple to-brand-pink flex items-center justify-center mr-3">
                               <IconSparkles />
                           </div>
                           <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                                <p className="text-xs text-gray-400">Powered by Gemini</p>
                           </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-500/20"><IconClose /></button>
                    </div>

                    {/* Messages */}
                    <div className="flex-grow p-4 overflow-y-auto">
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'model' && <div className="w-7 h-7 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0"><IconBot /></div>}
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-brand-purple text-white rounded-br-lg' : 'bg-gray-500/20 rounded-bl-lg'}`}>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                        {isLoading && msg.role === 'model' && index === messages.length -1 && <span className="inline-block w-1 h-4 bg-white animate-ping ml-1"></span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10 flex-shrink-0">
                        <form onSubmit={handleSubmit} className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask about your data..."
                                disabled={isLoading}
                                className="w-full bg-gray-500/10 border border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all"
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} className="p-2 rounded-lg bg-brand-purple text-white disabled:bg-gray-500/30 disabled:cursor-not-allowed transition-colors">
                                <IconSend />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-4 sm:right-6 lg:right-8 w-14 h-14 rounded-full bg-gradient-to-tr from-brand-purple to-brand-pink text-white shadow-lg z-50 flex items-center justify-center transition-transform hover:scale-110 animate-subtle-pulse"
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? <IconClose /> : <IconSparkles />}
            </button>
        </>
    );
};

// Icons
const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L13 12l-1.293 1.293a1 1 0 01-1.414 0L8 10.414a1 1 0 010-1.414L10.293 6.707a1 1 0 011.414 0L13 8l2.293-2.293a1 1 0 011.414 0L18 7.414a1 1 0 010 1.414L16.707 10.121a1 1 0 01-1.414 0L14 8.828 12.293 10.536a1 1 0 01-1.414 0L9.586 9.243a1 1 0 010-1.414L11 6.121" /></svg>;
const IconClose = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconSend = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;
const IconBot = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6a2 2 0 100-4 2 2 0 000 4zm0 14a2 2 0 100-4 2 2 0 000 4zm6-8a2 2 0 100-4 2 2 0 000 4zm-12 0a2 2 0 100-4 2 2 0 000 4z" /></svg>;

export default ChatAssistant;
