
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import FloatingLabelInput from '../components/forms/FloatingLabelInput';
import FloatingLabelTextarea from '../components/forms/FloatingLabelTextarea';
import type { ToastData } from '../components/Toast';
import type { OnboardingData, CompetitorData } from '../types';

interface SettingsPageProps {
  showToast: (data: ToastData) => void;
  appData: OnboardingData;
  setAppData: (data: OnboardingData) => void;
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ label, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple dark:focus:ring-offset-dark-bg ${
          enabled ? 'bg-brand-purple' : 'bg-gray-200 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};


const SettingsPage: React.FC<SettingsPageProps> = ({ showToast, appData, setAppData }) => {
  const [brandName, setBrandName] = useState(appData.brandName);
  const [keywords, setKeywords] = useState(appData.keywords);
  const [competitors, setCompetitors] = useState<CompetitorData[]>(appData.competitors || []);
  const [newCompetitorName, setNewCompetitorName] = useState('');
  const [newCompetitorScore, setNewCompetitorScore] = useState('');
  const [platforms, setPlatforms] = useState({
    gemini: true,
    chatgpt: true,
    claude: false,
  });

  useEffect(() => {
    setBrandName(appData.brandName);
    setKeywords(appData.keywords);
    setCompetitors(appData.competitors || []);
  }, [appData]);

  const handlePlatformToggle = (platform: keyof typeof platforms) => {
    setPlatforms(prev => ({ ...prev, [platform]: !prev[platform] }));
  };
  
  const handleAddCompetitor = () => {
    if (newCompetitorName.trim() && newCompetitorScore.trim()) {
      const score = parseInt(newCompetitorScore, 10);
      if (!isNaN(score) && score >= 0 && score <= 100) {
        setCompetitors([...competitors, { name: newCompetitorName.trim(), visibility: score }]);
        setNewCompetitorName('');
        setNewCompetitorScore('');
      } else {
        showToast({ message: 'Please enter a valid score (0-100).', type: 'error' });
      }
    }
  };

  const handleRemoveCompetitor = (nameToRemove: string) => {
    setCompetitors(competitors.filter(c => c.name !== nameToRemove));
  };
  
  const handleSave = () => {
    setAppData({ brandName, keywords, competitors });
    console.log('Saving settings:', { brandName, keywords, platforms, competitors });
    showToast({ message: 'Settings saved successfully!', type: 'success' });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <div className="space-y-8">
          <FloatingLabelInput
            id="brandName"
            label="Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
          <FloatingLabelTextarea
            id="keywords"
            label="Keywords to Track"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            rows={4}
            helpText="Separate keywords with a comma."
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Competitor Tracking</h2>
        <div className="space-y-4">
          <ul className="space-y-3">
            {competitors.map((competitor, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-500/10 p-3 rounded-lg">
                <div className="flex items-center">
                  <IconShield />
                  <span className="ml-3 font-medium">{competitor.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-3 hidden sm:inline">Score:</span>
                  <span className="font-bold text-lg text-brand-purple">{competitor.visibility}</span>
                  <button onClick={() => handleRemoveCompetitor(competitor.name)} className="ml-4 text-gray-400 hover:text-red-500 transition-colors">
                    <IconTrash />
                  </button>
                </div>
              </li>
            ))}
            {competitors.length === 0 && <p className="text-gray-500 text-center py-4">No competitors added yet.</p>}
          </ul>
          <div className="grid sm:grid-cols-[1fr_auto_auto] gap-2 pt-4 border-t border-white/10">
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
              value={newCompetitorScore}
              onChange={(e) => setNewCompetitorScore(e.target.value)}
              className="w-full sm:w-24"
             />
            <Button onClick={handleAddCompetitor} disabled={!newCompetitorName.trim() || !newCompetitorScore.trim()}>Add</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Tracked AI Platforms</h2>
            <ToggleSwitch label="Google Gemini" enabled={platforms.gemini} onChange={() => handlePlatformToggle('gemini')} />
            <ToggleSwitch label="OpenAI ChatGPT" enabled={platforms.chatgpt} onChange={() => handlePlatformToggle('chatgpt')} />
            <ToggleSwitch label="Anthropic Claude" enabled={platforms.claude} onChange={() => handlePlatformToggle('claude')} />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};

const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconShield = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606 11.955 11.955 0 019 2.606 12.02 12.02 0 00-2.382-9.016z" /></svg>;

export default SettingsPage;