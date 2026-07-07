import axios, { AxiosInstance } from 'axios';
import { AnalysisResult, UploadResponse } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// File upload
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Get analysis results
export const getAnalysis = async (
  fileId: string,
  fileName: string
): Promise<{ success: boolean; data: AnalysisResult }> => {
  const response = await api.post('/analysis/full', {
    fileId,
    fileName,
  });

  return response.data;
};

// Get KPIs only
export const getKPIs = async (
  fileId: string,
  fileName: string
): Promise<{ success: boolean; data: any }> => {
  const response = await api.post('/analysis/kpis', {
    fileId,
    fileName,
  });

  return response.data;
};

// Export as PDF
export const exportPDF = async (analysisData: AnalysisResult): Promise<Blob> => {
  const response = await api.post('/export/pdf', { analysisData }, {
    responseType: 'blob',
  });

  return response.data;
};

// Export as PPT
export const exportPPT = async (analysisData: AnalysisResult): Promise<Blob> => {
  const response = await api.post('/export/ppt', { analysisData }, {
    responseType: 'blob',
  });

  return response.data;
};

// Export as Excel
export const exportExcel = async (analysisData: AnalysisResult): Promise<Blob> => {
  const response = await api.post('/export/excel', { analysisData }, {
    responseType: 'blob',
  });

  return response.data;
};

export default api;
