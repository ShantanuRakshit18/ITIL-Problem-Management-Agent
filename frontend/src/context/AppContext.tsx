import React, { createContext, useState, useCallback } from 'react';
import { AnalysisResult } from '../types';

interface AppContextType {
  analysisData: AnalysisResult | null;
  setAnalysisData: (data: AnalysisResult | null) => void;
  uploadedFileName: string | null;
  setUploadedFileName: (name: string | null) => void;
  uploadedFileId: string | null;
  setUploadedFileId: (id: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  step: 'upload' | 'analyse' | 'report';
  setStep: (step: 'upload' | 'analyse' | 'report') => void;
  resetFlow: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'analyse' | 'report'>('upload');

  const resetFlow = useCallback(() => {
    setAnalysisData(null);
    setUploadedFileName(null);
    setUploadedFileId(null);
    setError(null);
    setStep('upload');
  }, []);

  const value: AppContextType = {
    analysisData,
    setAnalysisData,
    uploadedFileName,
    setUploadedFileName,
    uploadedFileId,
    setUploadedFileId,
    isLoading,
    setIsLoading,
    error,
    setError,
    step,
    setStep,
    resetFlow,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
