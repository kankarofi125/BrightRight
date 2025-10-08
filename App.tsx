
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import KeywordsPage from './pages/KeywordsPage';
import OnboardingModal from './components/OnboardingModal';
import { Toast, ToastData } from './components/Toast';
import { Page, OnboardingData, TourStep, User, UserAccount } from './types';
import PricingPage from './pages/PricingPage';
import ResourcesPage from './pages/ResourcesPage';
import ChangelogPage from './pages/ChangelogPage';
import DocsPage from './pages/DocsPage';
import AuthPage from './pages/AuthPage';
import Logo from './components/Logo';
import InitialAnalysisModal from './components/InitialAnalysisModal';
import GuidedTour from './components/GuidedTour';
import ChatAssistant from './components/ChatAssistant';

const USERS_STORAGE_KEY = 'brightRankUsers';
const APP_DATA_STORAGE_KEY = 'brightRankData';
const TOUR_STORAGE_KEY = 'brightRankTourCompleted';
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const IconChevronDown: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const IconExternalLink: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002 2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;

const PublicHeader: React.FC<{
    setCurrentPage: (page: Page) => void;
    setAuthMode: (mode: 'login' | 'register') => void;
}> = ({ setCurrentPage, setAuthMode }) => {
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
    
    const handleNavAuth = (mode: 'login' | 'register', page: Page = 'auth') => {
        setAuthMode(mode);
        setCurrentPage(page);
        setMobileMenuOpen(false);
    }

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
                    <div className="hidden md:flex items-center space-x-2">
                         <button onClick={() => handleNavAuth('login')} className="px-4 py-2 rounded-lg font-medium transition-all duration-300 text-gray-300 hover:text-white">
                            Login
                        </button>
                        <button onClick={() => handleNavAuth('register')} className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-gray-500/20 text-gray-200 hover:bg-gray-500/30">
                            Sign Up
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
            <div className={`md:hidden fixed top-16 left-0 right-0 bottom-0 bg-dark-bg transition-transform duration-300 ease-in-out z-40 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="container mx-auto h-full flex flex-col items-center justify-center">
                     <ul className="flex flex-col items-center space-y-3 text-base text-gray-300 text-center">
                        <li><a onClick={() => handleMobileLinkClick('changelog')} className="cursor-pointer hover:text-white transition-colors">CHANGELOG</a></li>
                        <li><a onClick={() => handleMobileLinkClick('pricing')} className="cursor-pointer hover:text-white transition-colors">PRICING</a></li>
                        <li><a onClick={() => handleMobileLinkClick('docs')} className="cursor-pointer hover:text-white transition-colors">DOCS</a></li>
                        <li>
                            <button onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)} className="flex items-center hover:text-white transition-colors">
                                RESOURCES <IconChevronDown className={`ml-2 w-5 h-5 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {mobileResourcesOpen && (
                                <div className="mt-3 space-y-2 text-sm animate-fade-in text-gray-400">
                                    <a onClick={() => handleMobileLinkClick('resources')} className="block cursor-pointer hover:text-white transition-colors">FAQs</a>
                                    <a href="#" className="flex items-center justify-center hover:text-white transition-colors">Report a bug <IconExternalLink className="h-5 w-5 ml-2" /></a>
                                    <a href="#" className="flex items-center justify-center hover:text-white transition-colors">Suggest an idea <IconExternalLink className="h-5 w-5 ml-2" /></a>
                                    <a href="#" className="flex items-center justify-center hover:text-white transition-colors">Billing support <IconExternalLink className="h-5 w-5 ml-2" /></a>
                                    <a href="#" className="flex items-center justify-center hover:text-white transition-colors">Discord community <IconExternalLink className="h-5 w-5 ml-2" /></a>
                                </div>
                            )}
                        </li>
                        <li className="pt-4 flex flex-col items-center gap-3">
                            <button onClick={() => handleNavAuth('login')} className="px-6 py-2 w-48 text-lg rounded-lg font-medium transition-all duration-300 text-gray-300 hover:text-white">
                                Login
                            </button>
                            <button onClick={() => handleNavAuth('register')} className="px-6 py-2 w-48 text-lg rounded-lg font-semibold transition-all duration-300 bg-gray-500/20 text-gray-200 hover:bg-gray-500/30">
                                Sign Up
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
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [appData, setAppData] = useState<OnboardingData | null>(null);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isInitialAnalysis, setIsInitialAnalysis] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const timeoutId = useRef<number | null>(null);

  const showToast = useCallback((data: ToastData) => {
    setToast(data);
    setTimeout(() => setToast(null), 5000);
  }, []);

  const handleLogout = useCallback((message: string, type: 'success' | 'error' = 'success') => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
      setCurrentUser(null);
      setAppData(null);
      setCurrentPage('landing');
      showToast({ message, type });
  }, [showToast]);

  useEffect(() => {
    const events: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    const resetTimeout = () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
      timeoutId.current = window.setTimeout(() => {
        handleLogout('Your session has expired due to inactivity.', 'error');
      }, SESSION_TIMEOUT);
    };

    if (currentUser) {
      resetTimeout();
      events.forEach(event => window.addEventListener(event, resetTimeout));
    }

    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
      events.forEach(event => window.removeEventListener(event, resetTimeout));
    };
  }, [currentUser, handleLogout]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error("Failed to load users from localStorage", error);
    }
  }, []);
  
  useEffect(() => {
    if (currentUser) {
      try {
        const allDataStr = localStorage.getItem(APP_DATA_STORAGE_KEY);
        if (allDataStr) {
          const allData = JSON.parse(allDataStr);
          const userData = allData[currentUser.email];
          if (userData) {
            if (!userData.competitors) userData.competitors = [];
            setAppData(userData);
          } else {
            setAppData(null);
            setShowOnboarding(true);
          }
        } else {
          setAppData(null);
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error("Failed to parse app data from localStorage", error);
        setAppData(null);
      }
    }
  }, [currentUser]);

  const handleSetAppData = (data: OnboardingData) => {
    if (!currentUser) return;

    setAppData(data);
    try {
        const allDataStr = localStorage.getItem(APP_DATA_STORAGE_KEY);
        const allData = allDataStr ? JSON.parse(allDataStr) : {};
        allData[currentUser.email] = data;
        localStorage.setItem(APP_DATA_STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
        console.error("Failed to save app data to localStorage", error);
        showToast({ message: 'Could not save your data.', type: 'error' });
    }
  };
  
  const handleRegister = (email: string, pass: string) => {
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        showToast({ message: 'An account with this email already exists.', type: 'error' });
        return;
    }
    const newUserAccount: UserAccount = { email, passwordHash: pass }; // Not hashing for simplicity
    const updatedUsers = [...users, newUserAccount];
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    setCurrentUser({ email });
    showToast({ message: 'Account created successfully!', type: 'success' });
    // Onboarding is triggered by useEffect watching currentUser
  };

  const handleLogin = (email: string, pass: string) => {
      const userAccount = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (userAccount && userAccount.passwordHash === pass) {
          setCurrentUser({ email });
          setCurrentPage('dashboard');
          showToast({ message: `Welcome back!`, type: 'success' });
          // Data loading and onboarding check is handled by useEffect
      } else {
          showToast({ message: 'Invalid email or password.', type: 'error' });
      }
  };

  const handleOAuthLogin = (email: string, provider: 'Google' | 'Apple' | 'Microsoft') => {
    let userAccount = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!userAccount) {
        const newUserAccount: UserAccount = { email, passwordHash: `oauth_${provider.toLowerCase()}` };
        const updatedUsers = [...users, newUserAccount];
        setUsers(updatedUsers);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        console.log(`New user registered via ${provider}: ${email}`);
    }
    
    setCurrentUser({ email });
    setCurrentPage('dashboard');
    showToast({ message: `Welcome via ${provider}!`, type: 'success' });
  };


  const handleGetStarted = () => {
    setAuthMode('register');
    setCurrentPage('auth');
  };

  const handleLogoClickLogout = () => {
    handleLogout('You have been successfully logged out.');
  };

  const handleCloseOnboarding = () => {
      setShowOnboarding(false);
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    handleSetAppData(data);
    setIsInitialAnalysis(true);
    setCurrentPage('dashboard');
    setIsNewUser(true);
    showToast({ message: 'Welcome! Setting up your dashboard...', type: 'success' });
  };

  const handleAnalysisComplete = () => {
    setIsInitialAnalysis(false);
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (isNewUser && !tourCompleted) {
        setTimeout(() => setShowTour(true), 600);
    }
  };

  const handleTourClose = () => {
    setShowTour(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  };

  const tourSteps: TourStep[] = [
    { selector: '#tour-step-1', title: 'Your Visibility Score', content: 'This is your brand\'s overall score in AI conversations. We calculate it based on how often and how positively your brand is mentioned.', position: 'bottom' },
    { selector: '#tour-step-2', title: 'Select a Date Range', content: 'You can filter your dashboard data by different time periods to see trends and track progress.', position: 'bottom' },
    { selector: '#tour-step-3', title: 'Refresh Your Data', content: 'Click here to fetch the latest data. The dashboard updates automatically based on your plan.', position: 'bottom' },
    { selector: '#tour-step-4', title: 'Track Every Mention', content: 'Here you\'ll find a detailed log of every time your brand is mentioned, along with the context and sentiment.', position: 'top' },
    { selector: '#tour-step-5', title: 'Explore More', content: 'Use the sidebar to navigate to other sections like Keywords, Reports, and Settings to dive deeper.', position: 'right' },
  ];

  const renderPage = () => {
    const authenticatedPages: Page[] = ['dashboard', 'keywords', 'reports', 'settings'];
    if (authenticatedPages.includes(currentPage) && !currentUser) {
        return <LandingPage onGetStarted={handleGetStarted} />;
    }

    switch (currentPage) {
      case 'landing':
          return <LandingPage onGetStarted={handleGetStarted} />;
      case 'auth':
          return <AuthPage onLogin={handleLogin} onRegister={handleRegister} onOAuthLogin={handleOAuthLogin} initialMode={authMode} showToast={showToast} />;
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
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  const isAuthenticated = !!currentUser;
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
                onGoHome={handleLogoClickLogout}
                userEmail={currentUser?.email}
            />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {renderPage()}
                </div>
            </main>
            {isInitialAnalysis && <InitialAnalysisModal brandName={appData!.brandName} />}
            {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} onClose={handleCloseOnboarding} />}
            <GuidedTour isOpen={showTour} steps={tourSteps} onClose={handleTourClose} />
            <ChatAssistant appData={appData} />
            {toast && <Toast data={toast} onDismiss={() => setToast(null)} />}
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 font-sans">
        <PublicHeader setCurrentPage={setCurrentPage} setAuthMode={setAuthMode} />
         <main className="pt-16">
             {renderPage()}
        </main>
        {showOnboarding && currentUser && <OnboardingModal onComplete={handleOnboardingComplete} onClose={handleCloseOnboarding} />}
        {toast && <Toast data={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
};

export default App;
