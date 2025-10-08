
import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import FloatingLabelInput from '../components/forms/FloatingLabelInput';
import Logo from '../components/Logo';
import type { ToastData } from '../components/Toast';

interface AuthPageProps {
  onLogin: (email: string, pass: string) => void;
  onRegister: (email: string, pass: string) => void;
  onOAuthLogin: (email: string, provider: 'Google' | 'Apple' | 'Microsoft') => void;
  initialMode?: 'login' | 'register';
  showToast: (data: ToastData) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, onOAuthLogin, initialMode = 'login', showToast }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(email, password);
    } else {
      if (password !== confirmPassword) {
        showToast({ message: "Passwords do not match.", type: 'error' });
        return;
      }
       if (password.length < 6) {
        showToast({ message: "Password must be at least 6 characters.", type: 'error' });
        return;
      }
      onRegister(email, password);
    }
  };
  
  const isRegister = mode === 'register';

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 pt-16">
      <div className="w-full max-w-md">
        <Card className="animate-fade-in">
          <div className="text-center mb-6">
            <Logo className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">{isRegister ? 'Create an Account' : 'Welcome Back'}</h2>
            <p className="text-gray-400 text-sm mt-1">{isRegister ? 'Start tracking your AI visibility.' : 'Sign in to continue to your dashboard.'}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <FloatingLabelInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <FloatingLabelInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
            {isRegister && (
              <FloatingLabelInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            )}
            
            <Button type="submit" variant="primary" className="w-full">
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-500/30"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or continue with</span>
            <div className="flex-grow border-t border-gray-500/30"></div>
          </div>

          <div className="space-y-3">
             <button onClick={() => onOAuthLogin('demo.google@example.com', 'Google')} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-500/30 rounded-lg hover:bg-gray-500/10 transition-colors">
                <IconGoogle />
                <span className="font-medium text-sm">Sign in with Google</span>
             </button>
             <button onClick={() => onOAuthLogin('demo.apple@example.com', 'Apple')} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-500/30 rounded-lg hover:bg-gray-500/10 transition-colors bg-white text-black dark:bg-white dark:text-black">
                <IconApple />
                <span className="font-medium text-sm">Sign in with Apple</span>
             </button>
             <button onClick={() => onOAuthLogin('demo.microsoft@example.com', 'Microsoft')} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-500/30 rounded-lg hover:bg-gray-500/10 transition-colors">
                <IconMicrosoft />
                <span className="font-medium text-sm">Sign in with Microsoft</span>
             </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setMode(isRegister ? 'login' : 'register')}
              className="font-semibold text-brand-purple hover:underline ml-2 focus:outline-none"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
};

const IconGoogle = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44.5 24c0-1.6-.1-3.2-.4-4.7H24v9.1h11.4c-.5 2.9-2 5.5-4.5 7.2v5.8h7.5c4.4-4.1 7-10 7-17.4z" fill="#4285F4"/>
        <path d="M24 48c6.5 0 12-2.1 16-5.7l-7.5-5.8c-2.1 1.4-4.8 2.3-7.5 2.3-5.8 0-10.7-3.9-12.5-9.1H3.9v5.9C7.9 42.6 15.4 48 24 48z" fill="#34A853"/>
        <path d="M11.5 28.7c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8V15.2H3.9C2.8 17.6 2 20.7 2 24s.8 6.4 2.1 8.8l7.6-5.9z" fill="#FBBC05"/>
        <path d="M24 9.8c3.4 0 6.3 1.2 8.6 3.4l6.6-6.6C36 2.2 30.5 0 24 0 15.4 0 7.9 5.4 3.9 13.2l7.6 5.9c1.8-5.2 6.7-9.1 12.5-9.1z" fill="#EA4335"/>
    </svg>
);

const IconApple = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.228 9.772c.02-.01.44-.27.44-1.22 0-1.21-.79-1.8-1.92-1.81-.02 0-.03.01 0 0-1.12 0-1.9.61-2.47.61s-1.3-.59-2.33-.58c-1.23.02-2.2.7-2.73 1.83-.54 1.14-.33 2.8.31 3.94.39.7.83 1.49 1.41 1.95.53.41 1.13.62 1.76.62s1.08-.22 1.63-.64c.2-.16.37-.32.53-.47l.02-.02c.48-.47.8-1.02.8-1.02s-.52 1.51 1.12 1.5c1.19-.01 1.4-1.74.45-2.47z"/>
        <path d="M12.003 2.001a9.96 9.96 0 00-4.04 1.15c.09-.04 1.47-1.01 1.48-.99.01.02-1.15 1.78-1.15 1.78s1.6-1.05 3.32-.96c.65.03 2.24.32 2.24 1.93 0 .01 0 .01 0 0-2.32.18-3.52 1.5-3.52 1.5s1.78-1.14 3.33-.9c1.45.22 2.24 1.19 2.24 1.22s-.1.08-2.6-1.28c0 0-1.63 2.17 1.47 2.17 1.54 0 2.37-.7 2.45-.75-.12-.01-.13-.01-2.12-.91s2.22-1.23 2.22-3.13c0-1.8-1.3-2.68-2.6-2.88a6.1 6.1 0 00-2.22-.31z"/>
    </svg>
);

const IconMicrosoft = () => (
    <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1h9v9H1V1z" fill="#F25022"/>
        <path d="M11 1h9v9h-9V1z" fill="#7FBA00"/>
        <path d="M1 11h9v9H1v-9z" fill="#00A4EF"/>
        <path d="M11 11h9v9h-9v-9z" fill="#FFB900"/>
    </svg>
);


export default AuthPage;
