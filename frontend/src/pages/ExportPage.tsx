import React from 'react';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';
import { exportPDF, exportPPT, exportExcel } from '../services/api';
import { FileText, Presentation, Table, Loader2, AlertCircle } from 'lucide-react';

const ExportPage: React.FC = () => {
  const { analysisData, isLoading, setIsLoading, error, setError, resetFlow } = useApp();
  const [exporting, setExporting] = React.useState<'pdf' | 'ppt' | 'excel' | null>(null);

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-yellow-900">No Analysis Data</p>
              <p className="text-sm text-yellow-700 mt-1">Please complete the analysis first</p>
            </div>
          </div>
          <Button onClick={resetFlow} variant="primary" size="lg" className="mt-6">
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  const handleExport = async (format: 'pdf' | 'ppt' | 'excel') => {
    setExporting(format);
    setError(null);

    try {
      let blob: Blob;
      let filename: string;

      if (format === 'pdf') {
        blob = await exportPDF(analysisData);
        filename = 'itil-analysis-report.pdf';
      } else if (format === 'ppt') {
        blob = await exportPPT(analysisData);
        filename = 'itil-analysis-report.pptx';
      } else {
        blob = await exportExcel(analysisData);
        filename = 'itil-analysis-report.xlsx';
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(`Failed to export ${format.toUpperCase()}: ${err.message}`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header title="Export Reports" subtitle="Download analysis in multiple formats" />
      <div className="max-w-4xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">PDF Report</h3>
            <p className="text-sm text-slate-600 mb-4">
              Professional PDF with all insights, charts, and recommendations
            </p>
            <Button
              onClick={() => handleExport('pdf')}
              variant="primary"
              size="sm"
              isLoading={exporting === 'pdf'}
              disabled={exporting !== null}
            >
              {exporting === 'pdf' ? 'Exporting...' : 'Download PDF'}
            </Button>
          </Card>

          <Card className="text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Presentation className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">PowerPoint</h3>
            <p className="text-sm text-slate-600 mb-4">
              Executive presentation with key findings and recommendations
            </p>
            <Button
              onClick={() => handleExport('ppt')}
              variant="primary"
              size="sm"
              isLoading={exporting === 'ppt'}
              disabled={exporting !== null}
            >
              {exporting === 'ppt' ? 'Exporting...' : 'Download PPT'}
            </Button>
          </Card>

          <Card className="text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Table className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Excel</h3>
            <p className="text-sm text-slate-600 mb-4">
              Detailed data export with all analysis metrics and tables
            </p>
            <Button
              onClick={() => handleExport('excel')}
              variant="primary"
              size="sm"
              isLoading={exporting === 'excel'}
              disabled={exporting !== null}
            >
              {exporting === 'excel' ? 'Exporting...' : 'Download Excel'}
            </Button>
          </Card>
        </div>

        <Card title="Report Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-600 mb-1">File Analyzed</p>
              <p className="font-semibold text-slate-900">{analysisData.fileName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Analysis Date</p>
              <p className="font-semibold text-slate-900">
                {new Date(analysisData.analysisDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Records</p>
              <p className="font-semibold text-slate-900">{analysisData.kpis.totalRecords}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Health Score</p>
              <p className="font-semibold text-slate-900">{analysisData.kpis.healthScore}/100</p>
            </div>
          </div>
        </Card>

        <div className="flex gap-4 justify-center mt-8">
          <Button onClick={resetFlow} variant="secondary" size="lg">
            Analyze Another File
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
