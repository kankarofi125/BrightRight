

import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { OnboardingData, CompetitorData } from '../types';
import FloatingLabelInput from './forms/FloatingLabelInput';
import FloatingLabelTextarea from './forms/FloatingLabelTextarea';


interface OnboardingModalProps {
  onComplete: (data: OnboardingData) => void;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [brandName, setBrandName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [newCompetitorName, setNewCompetitorName] = useState('');
  const [newCompetitorScore, setNewCompetitorScore] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 500); // Corresponds to slide-down animation duration
  };

  const handleBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brandName.trim() && keywords.trim()) {
      setStep(3); // Move to competitor step
    }
  };

  const handleFinalSubmit = () => {
    onComplete({ brandName, keywords, competitors });
    handleClose();
  };
  
  const handleAddCompetitor = () => {
    if (newCompetitorName.trim() && newCompetitorScore.trim()) {
      const score = parseInt(newCompetitorScore, 10);
      if (!isNaN(score) && score >= 0 && score <= 100) {
        setCompetitors([...competitors, { name: newCompetitorName.trim(), visibility: score }]);
        setNewCompetitorName('');
        setNewCompetitorScore('');
      }
    }
  };

  const handleRemoveCompetitor = (nameToRemove: string) => {
    setCompetitors(competitors.filter(c => c.name !== nameToRemove));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-2xl flex items-center justify-center">
              <IconSparkles />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Welcome to BrightRank.AI</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Let's get your dashboard set up in a few seconds.</p>
            <Button onClick={() => setStep(2)} variant="primary" className="w-full">Get Started</Button>
          </div>
        );
      case 2:
        return (
          <form onSubmit={handleBrandSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Tell us about your brand</h2>
            <div className="space-y-6">
              <FloatingLabelInput
                id="onboardingBrandName"
                label="Brand Name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
              />
              <FloatingLabelTextarea
                id="onboardingKeywords"
                label="Keywords to Track"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                rows={3}
                required
                helpText="Separate keywords with a comma."
              />
            </div>
            <div className="mt-8 flex justify-end">
              <Button type="submit" variant="primary" className="w-full">Continue</Button>
            </div>
          </form>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">Track Your Competitors</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center text-sm">Optional: Add competitors to see how you stack up. You can change this later.</p>

            <div className="space-y-4">
              <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
                {competitors.map((competitor, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-500/10 p-2 rounded-lg animate-fade-in">
                    <span className="font-medium">{competitor.name}</span>
                    <div className="flex items-center">
                      <span className="font-bold text-brand-purple mr-3">{competitor.visibility}</span>
                      <button onClick={() => handleRemoveCompetitor(competitor.name)} className="p-1 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                        <IconTrash />
                      </button>
                    </div>
                  </li>
                ))}
                {competitors.length === 0 && <p className="text-gray-500 text-center py-4">No competitors added yet.</p>}
              </ul>
              
              <div className="grid grid-cols-[1fr_auto_auto] gap-2 pt-4 border-t border-white/10">
                 <FloatingLabelInput
                  id="competitorName"
                  label="Competitor Name"
                  value={newCompetitorName}
                  onChange={(e) => setNewCompetitorName(e.target.value)}
                 />
                 <FloatingLabelInput
                  id="competitorScore"
                  label="Score"
                  type="number"
                  min="0"
                  max="100"
                  value={newCompetitorScore}
                  onChange={(e) => setNewCompetitorScore(e.target.value)}
                  className="w-24"
                 />
                <Button type="button" onClick={handleAddCompetitor} disabled={!newCompetitorName.trim() || !newCompetitorScore.trim()}>Add</Button>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
                <Button onClick={() => setStep(2)} variant="secondary" className="w-full">Back</Button>
                <Button onClick={() => setStep(4)} variant="primary" className="w-full">Continue to Review</Button>
            </div>
          </div>
        );
      case 4:
        return (
            <div>
                 <div className="text-center">
                    <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-tr from-brand-purple to-brand-pink rounded-2xl flex items-center justify-center">
                        <IconCheckCircle />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Review Your Setup</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Please confirm the details below before we build your dashboard.</p>
                </div>
                <div className="space-y-4 text-left p-4 bg-gray-500/10 rounded-lg max-h-60 overflow-y-auto">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400">Brand Name</h3>
                        <p className="dark:text-white font-medium">{brandName}</p>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                        <h3 className="text-sm font-semibold text-gray-400">Keywords</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {keywords.split(',').map(k => k.trim()).filter(Boolean).map(keyword => (
                                <span key={keyword} className="bg-brand-purple/20 text-brand-purple/90 text-xs font-medium px-2.5 py-1 rounded-full">{keyword}</span>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                        <h3 className="text-sm font-semibold text-gray-400">Competitors</h3>
                        {competitors.length > 0 ? (
                            <ul className="mt-1 space-y-2">
                                {competitors.map(c => (
                                    <li key={c.name} className="flex justify-between items-center text-sm dark:text-white">
                                        <span>{c.name}</span>
                                        <span className="font-bold text-brand-purple">{c.visibility}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm mt-1">No competitors added.</p>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <Button onClick={() => setStep(3)} variant="secondary" className="w-full">Back</Button>
                    <Button onClick={handleFinalSubmit} variant="primary" className="w-full">Confirm & Start Tracking</Button>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 ${isExiting ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
    >
      <div className={`w-full max-w-lg ${isExiting ? 'animate-slide-down' : 'animate-slide-up'}`}>
        <Card className="w-full">
          {renderStep()}
        </Card>
      </div>
    </div>
  );
};

const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L13 12l-1.293 1.293a1 1 0 01-1.414 0L8 10.414a1 1 0 010-1.414L10.293 6.707a1 1 0 011.414 0L13 8l2.293-2.293a1 1 0 011.414 0L18 7.414a1 1 0 010 1.414L16.707 10.121a1 1 0 01-1.414 0L14 8.828 12.293 10.536a1 1 0 01-1.414 0L9.586 9.243a1 1 0 010-1.414L11 6.121" /></svg>;
const IconTrash = () => <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default OnboardingModal;