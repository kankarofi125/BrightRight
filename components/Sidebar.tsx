
import React, { useState } from 'react';
import type { Page } from '../types';
import Logo from './Logo';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  onGoHome: () => void;
  userEmail?: string;
}

const NavItem: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  id?: string;
}> = ({ page, currentPage, setCurrentPage, icon, label, isCollapsed, id }) => (
  <li id={id}>
    <button
      onClick={() => setCurrentPage(page)}
      className={`w-full flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-300 ${ isCollapsed ? 'justify-center' : ''} ${
        currentPage === page
          ? 'bg-brand-purple/10 text-brand-purple dark:text-white dark:bg-brand-purple/20'
          : 'hover:bg-gray-500/10 text-gray-500 dark:text-gray-400 hover:text-brand-purple dark:hover:text-white'
      }`}
      aria-current={currentPage === page ? 'page' : undefined}
    >
      {icon}
      <span className={`transition-all duration-300 whitespace-nowrap ${ currentPage === page ? 'font-semibold' : 'font-medium' } ${ isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-4' }`}>
        {label}
      </span>
    </button>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isDarkMode, setIsDarkMode, onGoHome, userEmail }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`relative ${isCollapsed ? 'w-24' : 'w-64'} transition-all duration-300 hidden md:block`}>
        <aside className={`fixed top-0 left-0 h-full flex flex-col ${isCollapsed ? 'w-24' : 'w-64'} p-4 bg-light-card dark:bg-dark-card backdrop-blur-xl shadow-glass border-r border-white/10 transition-all duration-300`}>
          <div className="flex items-center justify-between mb-8">
             <div 
              onClick={onGoHome}
              className={`flex items-center cursor-pointer`}
            >
                <Logo className="w-10 h-10 flex-shrink-0" />
                <h1 className={`text-xl font-bold text-gray-900 dark:text-white ml-3 whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                  BrightRank
                </h1>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1 rounded-full hover:bg-gray-500/20 text-gray-500 dark:text-gray-400 absolute left-full -ml-5 bg-light-card dark:bg-dark-bg border border-white/10 ${isCollapsed ? '' : ''}`}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <IconChevronRight /> : <IconChevronLeft />}
            </button>
          </div>

          <nav className="flex-grow">
            <ul>
              <NavItem page="dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<IconDashboard />} label="Dashboard" isCollapsed={isCollapsed} />
              <NavItem page="keywords" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<IconTag />} label="Keywords" isCollapsed={isCollapsed} />
              <NavItem page="reports" id="tour-step-5" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<IconChart />} label="Reports" isCollapsed={isCollapsed} />
              <NavItem page="settings" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<IconSettings />} label="Settings" isCollapsed={isCollapsed} />
            </ul>
          </nav>
          
          <div className="space-y-4">
              <div className={`p-2 rounded-lg bg-gray-500/5 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-400">
                        <IconUser />
                    </div>
                    <div className={`ml-3 overflow-hidden ${isCollapsed ? 'w-0' : 'w-auto'}`}>
                        <p className="font-semibold text-sm whitespace-nowrap truncate">{userEmail ? 'Welcome' : 'Demo User'}</p>
                        <p className="text-xs text-gray-400 whitespace-nowrap truncate">{userEmail || 'user@example.com'}</p>
                    </div>
                </div>
              </div>

             <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-gray-500/10">
                <button
                  onClick={() => setIsDarkMode(false)}
                  className={`flex items-center justify-center p-2 rounded-md transition-colors text-gray-500 ${!isDarkMode ? 'bg-white dark:bg-dark-bg shadow' : ''}`}
                  aria-label="Switch to light mode"
                >
                    <IconSun />
                </button>
                <button
                  onClick={() => setIsDarkMode(true)}
                  className={`flex items-center justify-center p-2 rounded-md transition-colors text-gray-400 ${isDarkMode ? 'bg-white dark:bg-dark-bg shadow' : ''}`}
                  aria-label="Switch to dark mode"
                >
                    <IconMoon />
                </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-light-card dark:bg-dark-card backdrop-blur-xl shadow-glass border-t border-white/10 z-50">
        <nav className="flex justify-around p-2">
            <button onClick={onGoHome} className="p-3 rounded-lg text-gray-500" aria-label="Go home"><IconHome /></button>
            <MobileNavItem page="dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<IconDashboard />} />
            <MobileNavItem page="keywords" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<IconTag />} />
            <MobileNavItem page="reports" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<IconChart />} />
            <MobileNavItem page="settings" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<IconSettings />} />
        </nav>
      </div>
    </>
  );
};

const MobileNavItem: React.FC<{
    page: Page;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    icon: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, icon }) => (
    <button
        onClick={() => setCurrentPage(page)}
        className={`p-3 rounded-lg transition-colors duration-200 ${ currentPage === page ? 'text-brand-purple' : 'text-gray-500'}`}
        aria-label={`Go to ${page} page`}
    >
        {icon}
    </button>
);


const IconHome = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const IconChart = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconSun = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const IconMoon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const IconChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const IconChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const IconTag = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM11 11h.01M11 15h.01M15 11h.01M15 15h.01M7 15h.01M7 19h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a2 2 0 012-2z" /></svg>;
const IconUser = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IconPricing = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 13v-1m-4-6H6m12 0h-2" /></svg>;
const IconResources = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const IconChangelog = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconDocs = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.25278C12 6.25278 4.75278 3 4.75278 3C4.75278 3 4.75278 17.3019 12 21C19.2472 17.3019 19.2472 3 19.2472 3C19.2472 3 12 6.25278 12 6.25278Z" /></svg>;

export default Sidebar;
