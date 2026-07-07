import React, { useEffect } from 'react';
import Header from '../components/common/Header';
import { useApp } from '../context/AppContext';
import { getAnalysis } from '../services/api';
import Button from '../components/common/Button';
import KPICard from '../components/dashboard/KPICard';
import SeverityChart from '../components/dashboard/SeverityChart';
import TrendChart from '../components/dashboard/TrendChart';
import RootCauseTable from '../components/dashboard/RootCauseTable';
import OpenProblemsTable from '../components/dashboard/OpenProblemsTable';
import RecommendationsPanel from '../components/dashboard/RecommendationsPanel';
import McKinseySCR from '../components/executive/McKinseySCR';
import { AlertCircle, Loader2, BarChart3 } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const {
    analysisData,
    setAnalysisData,
    uploadedFileName,
    uploadedFileId,
    isLoading,
    setIsLoading,
    error,
    setError,
    setStep,
    resetFlow,
  } = useApp();

  useEffect(() => {
    if (!analysisData && uploadedFileId && uploadedFileName) {
      loadAnalysis();
    }
  }, [uploadedFileId, uploadedFileName]);

  const loadAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getAnalysis(uploadedFileId!, uploadedFileName!);
      setAnalysisData(result.data);
      setStep('analyse');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Header />
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-slate-900">Analyzing your data...</p>
          <p className="text-sm text-slate-600 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-4 mb-6">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Analysis Error</p>
              <p className="text-sm text-red-700 mt-1">{error || 'Unable to load analysis data'}</p>
            </div>
          </div>
          <Button onClick={resetFlow} variant="primary">
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header title="Analysis Dashboard" subtitle={analysisData.fileName} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* McKinsey SCR Executive Summary */}
        <div className="mb-12">
          <McKinseySCR data={analysisData.mckinseySCR} />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KPICard label="Total Problems" value={analysisData.kpis.totalRecords} />
          <KPICard label="Open Count" value={analysisData.kpis.openCount} />
          <KPICard label="Health Score" value={analysisData.kpis.healthScore} unit="/100" />
          <KPICard label="MTTR" value={analysisData.kpis.mttrEstimate} unit="hrs" />
          <KPICard label="P1 Proportion" value={analysisData.kpis.p1Proportion.toFixed(2)} unit="%" />
          <KPICard label="Reopen Rate" value={analysisData.kpis.reopenRate.toFixed(2)} unit="%" />
          <KPICard label="Proactive/Reactive" value={analysisData.kpis.proactiveReactiveRatio.toFixed(2)} />
          <KPICard label="Closed Count" value={analysisData.kpis.closedCount} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <SeverityChart data={analysisData.severityDistribution} />
          <TrendChart data={analysisData.trendData} />
        </div>

        {/* Root Cause & Open Problems */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <RootCauseTable data={analysisData.rootCauseIntelligence} />
          <OpenProblemsTable data={analysisData.openProblemRisks} />
        </div>

        {/* Strategic Recommendations */}
        <div className="mb-12">
          <RecommendationsPanel data={analysisData.strategicRecommendations} />
        </div>

        {/* Critical Findings */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              Critical Findings
            </h3>
            <div className="space-y-4">
              {analysisData.criticalFindings.map((finding) => (
                <div
                  key={finding.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    finding.severity === 'CRITICAL'
                      ? 'border-red-500 bg-red-50'
                      : finding.severity === 'HIGH'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <h4 className="font-semibold text-slate-900">{finding.title}</h4>
                  <p className="text-sm text-slate-700 mt-1">{finding.description}</p>
                  <p className="text-xs text-slate-600 mt-2">Affected Records: {finding.affectedRecords}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-2">{finding.recommendedAction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => setStep('report')} variant="primary" size="lg">
            <BarChart3 className="w-5 h-5" />
            Generate Reports
          </Button>
          <Button onClick={resetFlow} variant="secondary" size="lg">
            Analyze Another File
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
