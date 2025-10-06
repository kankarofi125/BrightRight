
import React from 'react';
import Card from './Card';

const IconEye = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;

const InitialAnalysisModal: React.FC<{ brandName: string }> = ({ brandName }) => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="w-full max-w-md animate-slide-up">
            <Card className="text-center p-8 w-full overflow-hidden">
                <div className="relative w-32 h-32 mx-auto mb-6">
                    {/* Radar Pulses */}
                    <div className="absolute inset-0 rounded-full border-2 border-brand-purple/50 animate-radar-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute inset-0 rounded-full border-2 border-brand-purple/50 animate-radar-pulse" style={{ animationDelay: '0.6s' }}></div>
                    <div className="absolute inset-0 rounded-full border-2 border-brand-purple/50 animate-radar-pulse" style={{ animationDelay: '1.2s' }}></div>
                    
                    {/* Central Pulsing Eye */}
                    <div className="absolute inset-0 flex items-center justify-center text-brand-pink animate-subtle-pulse">
                        <IconEye />
                    </div>
                </div>
                
                <h2
                  className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink mb-2 animate-text-gradient-shift opacity-0 animate-fade-in"
                  style={{ backgroundSize: '200% auto', animationDelay: '0.1s' }}
                >
                    Analyzing Visibility
                </h2>
                <p className="text-gray-400 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    Building your dashboard for "{brandName}". This may take a moment.
                </p>
                <div className="w-full bg-gray-500/20 rounded-full h-2 overflow-hidden relative opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="absolute top-0 left-0 h-full w-2/5 bg-gradient-to-r from-brand-purple to-brand-pink rounded-full animate-indeterminate-progress"></div>
                </div>
            </Card>
        </div>
    </div>
);

export default InitialAnalysisModal;