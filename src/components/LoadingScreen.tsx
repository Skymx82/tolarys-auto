'use client';

import { useEffect, useState } from 'react';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const steps = [
  'Initialisation du système...',
  'Configuration de l\'interface avancée...',
  'Optimisation des performances...',
  'Personnalisation de votre expérience...',
  'Redirection...',
];

const techWords = [
  'React', 'Next.js', 'TailwindCSS', 'TypeScript', 'API', 'Cloud', 
  'Sécurité', 'Performance', 'Analytics', 'Dashboard', 'Real-time'
];

interface LoadingScreenProps {
  targetPath: string;
  onComplete?: () => void;
}

export default function LoadingScreen({ targetPath, onComplete }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [techWord, setTechWord] = useState(techWords[0]);
  const router = useRouter();

  useEffect(() => {
    // Progress bar animation
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + 1, 100);
        
        // Update steps based on progress
        if (newProgress >= 20 && currentStep < 1) setCurrentStep(1);
        if (newProgress >= 40 && currentStep < 2) setCurrentStep(2);
        if (newProgress >= 60 && currentStep < 3) setCurrentStep(3);
        if (newProgress >= 80 && currentStep < 4) setCurrentStep(4);
        
        if (newProgress === 100) {
          setTimeout(() => {
            if (onComplete) onComplete();
            router.push(targetPath);
          }, 500);
          clearInterval(timer);
        }
        
        return newProgress;
      });
    }, 30);

    // Tech words animation
    const wordTimer = setInterval(() => {
      setTechWord(techWords[Math.floor(Math.random() * techWords.length)]);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(wordTimer);
    };
  }, [currentStep, onComplete, router, targetPath]);

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"></div>
      
      {/* Loading screen */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary-darker z-50 flex items-center justify-center overflow-hidden opacity-95">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="max-w-md w-full mx-auto p-6 relative">
          {/* Logo animation */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="text-4xl font-bold text-white animate-pulse flex items-center">
                <SparklesIcon className="h-8 w-8 mr-2 animate-spin-slow" />
                Tolarys
              </div>
              <div className="absolute -bottom-6 left-0 right-0 text-center text-sm text-white/80">
                {techWord}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative pt-1 mb-12">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-white/10 backdrop-blur-sm">
                  {progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-black/30 backdrop-blur-sm">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-white/80 to-white transition-all duration-500 ease-out relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-sparkle animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-transparent blur-xl -z-10"></div>
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center space-x-3 transition-all duration-300 ${
                  index <= currentStep ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-4'
                }`}
              >
                <div className={`
                  flex-shrink-0 h-6 w-6 rounded-full border-2 
                  ${index < currentStep ? 'border-white bg-white' : 'border-white/50'}
                  flex items-center justify-center
                  transition-all duration-300
                `}>
                  {index < currentStep && (
                    <CheckIcon className="h-4 w-4 text-primary" />
                  )}
                </div>
                <span className={`text-sm ${
                  index <= currentStep ? 'text-white' : 'text-white/50'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                <div
                  className="h-2 w-2 bg-white rounded-full opacity-20"
                  style={{
                    transform: `scale(${Math.random() * 0.5 + 0.5})`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Glowing orbs */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>
    </>
  );
}
