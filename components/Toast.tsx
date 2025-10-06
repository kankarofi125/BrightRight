
import React, { useState, useEffect } from 'react';

export interface ToastData {
  message: string;
  type: 'success' | 'error';
}

interface ToastProps {
  data: ToastData;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ data, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      const dismissTimer = setTimeout(onDismiss, 500);
      return () => clearTimeout(dismissTimer);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 500);
  };
  
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div
      className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg text-white shadow-lg ${typeClasses[data.type]} ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}
    >
      {data.type === 'success' ? <IconCheck /> : <IconError />}
      <p className="ml-3 font-medium">{data.message}</p>
      <button onClick={handleDismiss} className="ml-4 p-1 rounded-full hover:bg-black/20">
        <IconClose />
      </button>
    </div>
  );
};

const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconError = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconClose = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
