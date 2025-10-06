

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import KeywordsPage from './pages/KeywordsPage';
import OnboardingModal from './components/OnboardingModal';
import { Toast, ToastData } from './components/Toast';
import { Page, OnboardingData } from './types';
import PricingPage from './pages/PricingPage';
import ResourcesPage from './pages/ResourcesPage';
import ChangelogPage from './pages/ChangelogPage';
import DocsPage from './pages/DocsPage';
import JoinWaitlistModal from './components/JoinWaitlistModal';
import Logo from './components/Logo';
import InitialAnalysisModal from './components/InitialAnalysisModal';

const APP_DATA_KEY = 'brightRankData';

const IconChevronDown: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const IconExternalLink: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002 2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;

const PublicHeader: React.FC<{
    setCurrentPage: (page: Page) => void;
    onOpenWaitlist: () => void;
}> = ({ setCurrentPage, onOpenWaitlist }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);
    
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [mobileMenuOpen]);

    const handleMobileLinkClick = (page: Page) => {
        setCurrentPage(page);
        setMobileMenuOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/50 backdrop-blur-lg">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div onClick={() => { setCurrentPage('landing'); setMobileMenuOpen(false); }} className="text-2xl font-bold flex items-center cursor-pointer z-50">
                    <Logo className="w-8 h-8 mr-3" />
                    <span>BrightRank</span>
                </div>

                <div className="hidden md:flex items-center space-x-6">
                    <a onClick={() => setCurrentPage('changelog')} className="cursor-pointer hover:text-white transition-colors">CHANGELOG</a>
                    <a onClick={() => setCurrentPage('pricing')} className="cursor-pointer hover:text-white transition-colors">PRICING</a>
                    <a onClick={() => setCurrentPage('docs')} className="cursor-pointer hover:text-white transition-colors">DOCS</a>
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center hover:text-white transition-colors">
                            RESOURCES <IconChevronDown className={`ml-1 w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-dark-card border border-border-color rounded-md shadow-lg animate-fade-in">
                                <ul className="p-1">
                                    <li><a onClick={() => { handleMobileLinkClick('resources'); setDropdownOpen(false); }} className="block px-3 py-2 text-sm rounded-md hover:bg-gray-500/10 cursor-pointer">FAQs</a></li>
                                    <li><a href="#" className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-500/10 cursor-pointer">Report a bug <IconExternalLink className="h-4 w-4 text-gray-500" /></a></li>
                                    <li><a href="#" className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-500/10 cursor-pointer">Suggest an idea <IconExternalLink className="h-4 w-4 text-gray-500" /></a></li>
                                    <li><a href="#" className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-500/10 cursor-pointer">Billing support <IconExternalLink className="h-4 w-4 text-gray-500" /></a></li>
                                    <li><a href="#" className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-500/10 cursor-pointer">Discord community <IconExternalLink className="h-4 w-4 text-gray-500" /></a></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="hidden md:block">
                        <button onClick={onOpenWaitlist} className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-gray-500/20 text-gray-200 hover:bg-gray-500/30">
                            JOIN WAITLIST
                        </button>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 z-50 relative">
                            {mobileMenuOpen ? 
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> :
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                            }
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`md:hidden fixed top-0 left-0 w-full h-full bg-dark-bg transition-transform duration-300 ease-in-out z-40 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="container mx-auto h-full flex flex-col items-center justify-center">
                     <ul className="flex flex-col items-center space-y-6 text-lg text-gray-300 text-center">
                        <li><a onClick={() => handleMobileLinkClick('changelog')} className="cursor-pointer hover:text-white transition-colors">CHANGELOG</a></li>
                        <li><a onClick={() => handleMobileLinkClick('pricing')} className="cursor-pointer hover:text-white transition-colors">PRICING</a></li>
                        <li><a onClick={() => handleMobileLinkClick('docs')} className="cursor-pointer hover:text-white transition-colors">DOCS</a></li>
                        <li>
                            <button onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)} className="flex items-center hover:text-white transition-colors">
                                RESOURCES <IconChevronDown className={`ml-2 w-5 h-5 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {mobileResourcesOpen && (
                                <div className="mt-4 space-y-4 text-base animate-fade-in text-gray-400">
                                    <a onClick={() => handleMobileLinkClick('resources')} className="block cursor-pointer hover:text-white transition-colors">FAQs</a>
                                    <a href="#" className="flex items-center justify-center hover:text-white transition-colors">Report a bug <IconExternalLink className="h-5 w-5 ml-2" /></a>
                                    <a href="#" className="flex items-center justify-center hover:text-white transition-colors">Suggest an idea <IconExternalLink className="h-5 w-5 ml-2" /></a>
                                    <a href="#" className="flex items-center justify-center hover:text-white transition-colors">Billing support <IconExternalLink className="h-5 w-5 ml-2" /></a>
                                    <a href="#" className="flex items-center justify-center hover:text-white transition-colors">Discord community <IconExternalLink className="h-5 w-5 ml-2" /></a>
                                </div>
                            )}
                        </li>
                        <li className="pt-6">
                            <button onClick={() => { onOpenWaitlist(); setMobileMenuOpen(false); }} className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-gray-500/20 text-gray-200 hover:bg-gray-500/30">
                                JOIN WAITLIST
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [appData, setAppData] = useState<OnboardingData | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [isInitialAnalysis, setIsInitialAnalysis] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(APP_DATA_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (!parsedData.competitors) {
          parsedData.competitors = [];
        }
        setAppData(parsedData);
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error("Failed to parse app data from localStorage", error);
      setCurrentPage('landing');
    }
  }, []);

  const handleSetAppData = (data: OnboardingData) => {
    setAppData(data);
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
  };

  const showToast = useCallback((data: ToastData) => {
    setToast(data);
    setTimeout(() => setToast(null), 5000); // Increased timeout for better readability
  }, []);

  const handleStartTrial = () => {
    setShowOnboarding(true);
  };

  const handleOpenWaitlistModal = () => {
      setShowWaitlistModal(true);
  };

  const handleCloseWaitlistModal = () => {
      setShowWaitlistModal(false);
  };

  const handleJoinWaitlist = (email: string) => {
      console.log('Waitlist email:', email); // Mock sending email
      setShowWaitlistModal(false);
      showToast({ message: "You've been placed in the queue!", type: 'success' });
  };
  
  const handleGoHome = () => {
    setCurrentPage(appData ? 'dashboard' : 'landing');
  };

  const handleCloseOnboarding = () => {
      setShowOnboarding(false);
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    handleSetAppData(data);
    setIsInitialAnalysis(true);
    setCurrentPage('dashboard');
    showToast({ message: 'Welcome! Setting up your dashboard...', type: 'success' });
  };

  const handleAnalysisComplete = () => {
    setIsInitialAnalysis(false);
  };

  const renderPage = () => {
    // Guards to prevent rendering app pages without data, redirecting to landing if accessed directly.
    const authenticatedPages: Page[] = ['dashboard', 'keywords', 'reports', 'settings'];
    if (authenticatedPages.includes(currentPage) && !appData) {
        return <LandingPage onStartTrial={handleStartTrial} onOpenWaitlist={handleOpenWaitlistModal} />;
    }

    switch (currentPage) {
      case 'landing':
          return <LandingPage onStartTrial={handleStartTrial} onOpenWaitlist={handleOpenWaitlistModal} />;
      case 'dashboard':
        return <DashboardPage appData={appData!} isInitialAnalysis={isInitialAnalysis} onAnalysisComplete={handleAnalysisComplete} showToast={showToast} />;
      case 'keywords':
        return <KeywordsPage brandName={appData!.brandName} initialKeywords={appData!.keywords.split(',').map(k => k.trim()).filter(Boolean)} />;
      case 'reports':
        return <ReportsPage appData={appData!} />;
      case 'settings':
        return <SettingsPage showToast={showToast} appData={appData!} setAppData={handleSetAppData} />;
      case 'pricing':
        return <PricingPage />;
      case 'resources':
        return <ResourcesPage />;
      case 'changelog':
        return <ChangelogPage />;
      case 'docs':
        return <DocsPage />;
      default:
        return <LandingPage onStartTrial={handleStartTrial} onOpenWaitlist={handleOpenWaitlistModal} />;
    }
  };

  const isAuthenticated = !!appData;
  const isAppPage = ['dashboard', 'keywords', 'reports', 'settings'].includes(currentPage);
  const isAppLayout = isAuthenticated && isAppPage;

  if (isAppLayout) {
     return (
        <div className="min-h-screen flex bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                onGoHome={handleGoHome}
            />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {renderPage()}
                </div>
            </main>
            {isInitialAnalysis && <InitialAnalysisModal brandName={appData!.brandName} />}
            {toast && <Toast data={toast} onDismiss={() => setToast(null)} />}
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 font-sans">
        <PublicHeader setCurrentPage={setCurrentPage} onOpenWaitlist={handleOpenWaitlistModal} />
         <main className="pt-16">
             {renderPage()}
        </main>
        {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} onClose={handleCloseOnboarding} />}
        {showWaitlistModal && <JoinWaitlistModal onClose={handleCloseWaitlistModal} onJoin={handleJoinWaitlist} />}
        {toast && <Toast data={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
};

export default App;
