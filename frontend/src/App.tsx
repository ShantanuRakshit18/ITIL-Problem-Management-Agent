import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import ExportPage from './pages/ExportPage';

const AppRoutes: React.FC = () => {
  const { step } = useApp();

  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/dashboard" element={step === 'analyse' ? <DashboardPage /> : <Navigate to="/" />} />
      <Route path="/export" element={step === 'report' ? <ExportPage /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
