
import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import FloatingLabelInput from './forms/FloatingLabelInput';

interface JoinWaitlistModalProps {
  onClose: () => void;
  onJoin: (email: string) => void;
}

const JoinWaitlistModal: React.FC<JoinWaitlistModalProps> = ({ onClose, onJoin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && /^\S+@\S+\.\S+$/.test(email)) {
      onJoin(email);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-md animate-slide-up">
        <Card className="w-full relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1">
            <IconClose />
          </button>
          <form onSubmit={handleSubmit}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Join the Waitlist</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Be the first to know when we launch.</p>
            </div>
            <div className="space-y-6">
              <FloatingLabelInput
                id="waitlistEmail"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="mt-8">
              <Button type="submit" variant="primary" className="w-full" disabled={!email.trim()}>
                Join Waitlist
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

const IconClose = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

export default JoinWaitlistModal;
