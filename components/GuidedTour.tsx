
import React, { useState, useLayoutEffect, useRef } from 'react';
import type { TourStep } from '../types';

interface GuidedTourProps {
  steps: TourStep[];
  onClose: () => void;
  isOpen: boolean;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ steps, onClose, isOpen }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];

  useLayoutEffect(() => {
    if (!isOpen || !step) {
        setTargetRect(null);
        return;
    };

    const targetElement = document.querySelector(step.selector);
    if (targetElement) {
        const handleResize = () => {
            setTargetRect(targetElement.getBoundingClientRect());
        };
        handleResize(); // Initial position
        
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    } else {
      console.warn(`Tour target not found: ${step.selector}`);
      handleNext(); 
    }
  }, [currentStep, isOpen, step?.selector]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const getTooltipPosition = () => {
      if (!targetRect || !tooltipRef.current) return { opacity: 0 };
      
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const spacing = 15;
      const { innerWidth, innerHeight } = window;

      let top, left;

      switch(step.position) {
          case 'top':
              top = targetRect.top - tooltipHeight - spacing;
              left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
              break;
          case 'bottom':
              top = targetRect.bottom + spacing;
              left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
              break;
          case 'left':
              top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
              left = targetRect.left - tooltipWidth - spacing;
              break;
          case 'right':
              top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
              left = targetRect.right + spacing;
              break;
          default: // default to bottom
              top = targetRect.bottom + spacing;
              left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
              break;
      }

      // Keep tooltip within viewport
      if (left < spacing) left = spacing;
      if (left + tooltipWidth > innerWidth - spacing) left = innerWidth - tooltipWidth - spacing;
      if (top < spacing) top = spacing;
      if (top + tooltipHeight > innerHeight - spacing) top = innerHeight - tooltipHeight - spacing;

      return { top, left };
  };


  if (!isOpen || !targetRect) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Highlighter */}
      <div
        className="absolute rounded-lg transition-all duration-300 pointer-events-none"
        style={{
          width: targetRect.width + 10,
          height: targetRect.height + 10,
          top: targetRect.top - 5,
          left: targetRect.left - 5,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
        }}
      />
        
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute bg-dark-card border border-border-color rounded-lg p-5 w-80 shadow-2xl transition-all duration-300 animate-fade-in"
        style={getTooltipPosition()}
      >
        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
        <p className="text-gray-300 text-sm mb-4">{step.content}</p>
        
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">{currentStep + 1} / {steps.length}</span>
            <div className="flex gap-2">
                <button onClick={onClose} className="px-3 py-1 text-sm rounded-md hover:bg-gray-500/30">Skip</button>
                {currentStep > 0 && (
                    <button onClick={handlePrev} className="px-3 py-1 text-sm rounded-md bg-gray-500/20 hover:bg-gray-500/30">Back</button>
                )}
                {currentStep < steps.length - 1 ? (
                    <button onClick={handleNext} className="px-3 py-1 text-sm rounded-md bg-brand-purple hover:bg-opacity-90 text-white">Next</button>
                ) : (
                    <button onClick={onClose} className="px-3 py-1 text-sm rounded-md bg-brand-purple hover:bg-opacity-90 text-white">Finish</button>
                )}
            </div>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default GuidedTour;
