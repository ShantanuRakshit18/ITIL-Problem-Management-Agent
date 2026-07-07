// Problem record interface based on ServiceNow export
export interface ProblemRecord {
  id: string;
  problemId: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  category: string;
  rootCause: string;
  executiveSummary: string;
  status: 'Open' | 'Closed' | 'On Hold' | 'Reopened';
  closureNotes: string;
  createdDate: Date;
  closedDate?: Date;
  reopenCount: number;
  assignedTo?: string;
  description?: string;
}

export interface KPIData {
  totalRecords: number;
  openCount: number;
  closedCount: number;
  healthScore: number;
  mttrEstimate: number;
  p1Proportion: number;
  reopenRate: number;
  proactiveReactiveRatio: number;
}

export interface SeverityDistribution {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
}

export interface TrendData {
  date: string;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  total: number;
}

export interface RootCauseIntelligence {
  cause: string;
  frequency: number;
  percentage: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface OpenProblemRisk {
  problemId: string;
  severity: string;
  category: string;
  daysOpen: number;
  status: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  summary: string;
}

export interface ClosurePattern {
  theme: string;
  frequency: number;
  suggestedAction: string;
  itilPractice: string;
  impactRating: 'High' | 'Medium' | 'Low';
  effortRating: 'High' | 'Medium' | 'Low';
}

export interface StrategicRecommendation {
  id: string;
  title: string;
  description: string;
  itilPractice: string;
  impactRating: 'High' | 'Medium' | 'Low';
  effortRating: 'High' | 'Medium' | 'Low';
  priority: 1 | 2 | 3;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface CriticalFinding {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  affectedRecords: number;
  recommendedAction: string;
}

export interface McKinseySCR {
  situation: string;
  complication: string;
  resolution: string;
}

export interface AnalysisResult {
  fileId: string;
  fileName: string;
  analysisDate: string;
  kpis: KPIData;
  severityDistribution: SeverityDistribution;
  trendData: TrendData[];
  rootCauseIntelligence: RootCauseIntelligence[];
  openProblemRisks: OpenProblemRisk[];
  closurePatterns: ClosurePattern[];
  strategicRecommendations: StrategicRecommendation[];
  criticalFindings: CriticalFinding[];
  mckinseySCR: McKinseySCR;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  recordCount: number;
  fileName: string;
  timestamp: string;
}
