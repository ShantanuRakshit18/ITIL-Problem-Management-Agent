import React, { useRef, useState } from 'react';
import { Upload, File, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { useApp } from '../../context/AppContext';
import { uploadFile } from '../../services/api';

const FileUploader: React.FC = () => {
  const { setUploadedFileName, setUploadedFileId, setIsLoading, setError, setStep } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
      } else {
        setError('Only CSV and Excel files are supported');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await uploadFile(selectedFile);
      setUploadedFileName(response.fileName);
      setUploadedFileId(response.fileId);
      setStep('analyse');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Upload ServiceNow Data" subtitle="CSV or Excel format">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Drag and drop your file here
        </h3>
        <p className="text-slate-600 mb-6">or</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()} variant="secondary">
          Browse Files
        </Button>
      </div>

      {selectedFile && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
          <File className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{selectedFile.name}</p>
            <p className="text-sm text-slate-600">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button onClick={handleUpload} variant="primary" size="sm" className="ml-auto">
            Upload
          </Button>
        </div>
      )}
    </Card>
  );
};

export default FileUploader;
