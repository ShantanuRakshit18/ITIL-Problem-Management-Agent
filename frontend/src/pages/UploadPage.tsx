import React from 'react';
import Header from '../components/common/Header';
import FileUploader from '../components/upload/FileUploader';
import { useApp } from '../context/AppContext';
import Button from '../components/common/Button';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const UploadPage: React.FC = () => {
  const { uploadedFileName, isLoading, error, step } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className={`flex items-center gap-3 pb-4 ${step === 'upload' ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  step === 'upload' ? 'bg-blue-600' : 'bg-green-600'
                }`}>
                  {step === 'upload' ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Step 1: Upload Data</p>
                  <p className="text-sm text-slate-600">Import ServiceNow problem records</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className={`flex items-center gap-3 pb-4 ${step === 'analyse' ? 'opacity-100' : 'opacity-60'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  step === 'analyse' ? 'bg-blue-600' : 'bg-slate-300'
                }`}>
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Step 2: Analyze</p>
                  <p className="text-sm text-slate-600">ITIL analysis & insights</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 pb-4 opacity-60">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-slate-300">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Step 3: Export</p>
                  <p className="text-sm text-slate-600">Generate reports</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className={`h-full bg-blue-600 transition-all ${
              step === 'upload' ? 'w-1/3' : step === 'analyse' ? 'w-2/3' : 'w-full'
            }`}></div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <FileUploader />

        {/* Success Message */}
        {uploadedFileName && !isLoading && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-green-900">File uploaded successfully!</p>
              <p className="text-sm text-green-700 mt-1">{uploadedFileName} is being analyzed...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
