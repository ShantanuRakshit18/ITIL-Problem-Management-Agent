import { ProblemRecord, AnalysisResult, KPIData, SeverityDistribution, TrendData, RootCauseIntelligence, OpenProblemRisk, ClosurePattern, StrategicRecommendation, CriticalFinding, McKinseySCR } from '../types';
import { getUploadedData } from './fileService';
import { addDays, differenceInDays, startOfDay } from 'date-fns';
import _ from 'lodash';

/**
 * Main analysis service orchestrator
 */
export async function analysisService(fileId: string, fileName: string): Promise<AnalysisResult> {
  const records = getUploadedData(fileId);

  if (!records || records.length === 0) {
    throw {
      statusCode: 404,
      code: 'NO_DATA_FOUND',
      message: 'No data found for the given file ID',
    };
  }

  // Calculate all analysis components
  const kpis = calculateKPIs(records);
  const severityDistribution = calculateSeverityDistribution(records);
  const trendData = calculateTrendData(records);
  const rootCauseIntelligence = analyzeRootCauses(records);
  const openProblemRisks = calculateOpenProblemRisks(records);
  const closurePatterns = analyzeClosurePatterns(records);
  const strategicRecommendations = generateRecommendations(records, closurePatterns);
  const criticalFindings = identifyCriticalFindings(records, kpis);
  const mckinseySCR = generateMcKinseySCR(records, kpis, criticalFindings);

  return {
    fileId,
    fileName,
    analysisDate: new Date().toISOString(),
    kpis,
    severityDistribution,
    trendData,
    rootCauseIntelligence,
    openProblemRisks,
    closurePatterns,
    strategicRecommendations,
    criticalFindings,
    mckinseySCR,
  };
}

/**
 * Calculate KPI metrics
 */
function calculateKPIs(records: ProblemRecord[]): KPIData {
  const total = records.length;
  const open = records.filter((r) => r.status !== 'Closed').length;
  const closed = records.filter((r) => r.status === 'Closed').length;

  // Calculate MTTR (Mean Time To Resolution) in hours
  const closedWithDates = records.filter(
    (r) => r.status === 'Closed' && r.createdDate && r.closedDate
  );
  const mttrHours =
    closedWithDates.length > 0
      ? _.meanBy(closedWithDates, (r) =>
          (new Date(r.closedDate!).getTime() - new Date(r.createdDate).getTime()) /
          (1000 * 60 * 60)
        )
      : 0;

  // Calculate P1 proportion
  const p1Count = records.filter((r) => r.severity === 'P1').length;
  const p1Proportion = (p1Count / total) * 100;

  // Calculate reopen rate
  const reopenCount = _.sumBy(records, (r) => r.reopenCount || 0);
  const reopenRate = total > 0 ? (reopenCount / total) * 100 : 0;

  // Calculate proactive vs reactive ratio
  const proactive = records.filter((r) => r.status === 'Closed' && r.rootCause).length;
  const reactive = total - proactive;
  const proactiveReactiveRatio = reactive > 0 ? proactive / reactive : proactive;

  // Calculate health score (0-100)
  const healthScore = Math.round(
    100 -
      (open / total) * 40 -
      (p1Proportion / 100) * 30 -
      (reopenRate / 100) * 30
  );

  return {
    totalRecords: total,
    openCount: open,
    closedCount: closed,
    healthScore: Math.max(0, Math.min(100, healthScore)),
    mttrEstimate: Math.round(mttrHours),
    p1Proportion: Math.round(p1Proportion * 100) / 100,
    reopenRate: Math.round(reopenRate * 100) / 100,
    proactiveReactiveRatio: Math.round(proactiveReactiveRatio * 100) / 100,
  };
}

/**
 * Calculate severity distribution
 */
function calculateSeverityDistribution(records: ProblemRecord[]): SeverityDistribution {
  return {
    p1: records.filter((r) => r.severity === 'P1').length,
    p2: records.filter((r) => r.severity === 'P2').length,
    p3: records.filter((r) => r.severity === 'P3').length,
    p4: records.filter((r) => r.severity === 'P4').length,
  };
}

/**
 * Calculate trend data (weekly aggregation)
 */
function calculateTrendData(records: ProblemRecord[]): TrendData[] {
  const grouped = _.groupBy(records, (r) => {
    const date = new Date(r.createdDate);
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return weekStart.toISOString().split('T')[0];
  });

  return Object.entries(grouped)
    .map(([date, group]) => {
      const p1 = group.filter((r) => r.severity === 'P1').length;
      const p2 = group.filter((r) => r.severity === 'P2').length;
      const p3 = group.filter((r) => r.severity === 'P3').length;
      const p4 = group.filter((r) => r.severity === 'P4').length;

      return {
        date,
        p1,
        p2,
        p3,
        p4,
        total: group.length,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Analyze root causes
 */
function analyzeRootCauses(records: ProblemRecord[]): RootCauseIntelligence[] {
  const causes = _.groupBy(
    records.filter((r) => r.rootCause),
    (r) => r.rootCause
  );

  const total = records.length;

  return Object.entries(causes)
    .map(([cause, group]) => ({
      cause: cause || 'Unknown',
      frequency: group.length,
      percentage: Math.round((group.length / total) * 10000) / 100,
      severity: determineCauseSeverity(cause, group),
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

/**
 * Determine severity of a root cause
 */
function determineCauseSeverity(
  cause: string,
  records: ProblemRecord[]
): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  const p1Count = records.filter((r) => r.severity === 'P1').length;
  const p1Percentage = (p1Count / records.length) * 100;

  if (p1Percentage > 50) return 'CRITICAL';
  if (p1Percentage > 30) return 'HIGH';
  if (p1Percentage > 10) return 'MEDIUM';
  return 'LOW';
}

/**
 * Calculate open problem risks
 */
function calculateOpenProblemRisks(records: ProblemRecord[]): OpenProblemRisk[] {
  const openRecords = records.filter((r) => r.status !== 'Closed');
  const today = new Date();

  return openRecords
    .map((record) => ({
      problemId: record.problemId,
      severity: record.severity,
      category: record.category,
      daysOpen: differenceInDays(today, new Date(record.createdDate)),
      status: determineOpenProblemStatus(record, today),
      summary: record.executiveSummary.substring(0, 100),
    }))
    .sort((a, b) => b.daysOpen - a.daysOpen);
}

/**
 * Determine open problem status
 */
function determineOpenProblemStatus(
  record: ProblemRecord,
  today: Date
): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  const daysOpen = differenceInDays(today, new Date(record.createdDate));

  if (record.severity === 'P1' && daysOpen > 2) return 'CRITICAL';
  if (record.severity === 'P1' || (record.severity === 'P2' && daysOpen > 7))
    return 'HIGH';
  if (record.severity === 'P2' || (record.severity === 'P3' && daysOpen > 14))
    return 'MEDIUM';
  return 'LOW';
}

/**
 * Analyze closure patterns
 */
function analyzeClosurePatterns(records: ProblemRecord[]): ClosurePattern[] {
  const closedRecords = records.filter((r) => r.status === 'Closed');
  const notes = closedRecords
    .map((r) => r.closureNotes)
    .filter((n) => n)
    .join(' ');

  // Extract themes from closure notes (simplified NLP)
  const themes = extractThemes(notes);

  return themes.map((theme) => ({
    theme: theme.name,
    frequency: theme.count,
    suggestedAction: generateSuggestedAction(theme.name),
    itilPractice: mapToITILPractice(theme.name),
    impactRating: theme.count > 10 ? 'High' : theme.count > 5 ? 'Medium' : 'Low',
    effortRating: 'Medium',
  }));
}

/**
 * Extract themes from text (simplified pattern matching)
 */
function extractThemes(
  text: string
): { name: string; count: number }[] {
  const patterns: { [key: string]: RegExp } = {
    'Configuration Issues': /config|setting|parameter|config/gi,
    'Patch Updates': /patch|update|version|upgrade/gi,
    'Hardware Failures': /hardware|disk|memory|cpu|drive|server/gi,
    'Connectivity Issues': /network|connection|connectivity|timeout|latency/gi,
    'Software Bugs': /bug|defect|error|crash|exception/gi,
    'Resource Exhaustion': /resource|memory|cpu|disk space|storage/gi,
  };

  const themes: { [key: string]: number } = {};

  for (const [name, pattern] of Object.entries(patterns)) {
    const matches = text.match(pattern);
    if (matches) {
      themes[name] = (themes[name] || 0) + matches.length;
    }
  }

  return Object.entries(themes)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Generate suggested action for a theme
 */
function generateSuggestedAction(theme: string): string {
  const actions: { [key: string]: string } = {
    'Configuration Issues':
      'Implement configuration management and change validation controls',
    'Patch Updates': 'Establish proactive patch management schedule',
    'Hardware Failures': 'Implement preventive maintenance and monitoring',
    'Connectivity Issues': 'Enhance network monitoring and redundancy',
    'Software Bugs': 'Increase test coverage and code review processes',
    'Resource Exhaustion': 'Implement capacity planning and resource monitoring',
  };

  return (
    actions[theme] ||
    'Analyze root cause patterns and implement preventive measures'
  );
}

/**
 * Map theme to ITIL practice
 */
function mapToITILPractice(theme: string): string {
  const mappings: { [key: string]: string } = {
    'Configuration Issues': 'Change Management',
    'Patch Updates': 'Change Management',
    'Hardware Failures': 'Asset Management',
    'Connectivity Issues': 'Incident Management',
    'Software Bugs': 'Release Management',
    'Resource Exhaustion': 'Capacity Management',
  };

  return mappings[theme] || 'Problem Management';
}

/**
 * Generate strategic recommendations
 */
function generateRecommendations(
  records: ProblemRecord[],
  closurePatterns: ClosurePattern[]
): StrategicRecommendation[] {
  const recommendations: StrategicRecommendation[] = [];
  const kpis = calculateKPIs(records);

  // P1 Focus
  if (kpis.p1Proportion > 20) {
    recommendations.push({
      id: 'rec-001',
      title: 'Reduce P1 Incident Volume',
      description: `Currently ${kpis.p1Proportion}% of problems are P1 severity. Focus on preventive actions to reduce critical issues.`,
      itilPractice: 'Incident Management',
      impactRating: 'High',
      effortRating: 'Medium',
      priority: 1,
      riskLevel: 'CRITICAL',
    });
  }

  // MTTR Improvement
  if (kpis.mttrEstimate > 72) {
    recommendations.push({
      id: 'rec-002',
      title: 'Improve Mean Time To Resolution',
      description: `Current MTTR is ${kpis.mttrEstimate} hours. Implement faster escalation paths and knowledge sharing.`,
      itilPractice: 'Problem Management',
      impactRating: 'High',
      effortRating: 'High',
      priority: 1,
      riskLevel: 'HIGH',
    });
  }

  // Reopen Rate
  if (kpis.reopenRate > 5) {
    recommendations.push({
      id: 'rec-003',
      title: 'Reduce Problem Reopen Rate',
      description: `Current reopen rate is ${kpis.reopenRate}%. Improve root cause analysis quality and fix validation.`,
      itilPractice: 'Problem Management',
      impactRating: 'Medium',
      effortRating: 'Medium',
      priority: 2,
      riskLevel: 'MEDIUM',
    });
  }

  // Closure patterns
  closurePatterns.slice(0, 2).forEach((pattern, index) => {
    recommendations.push({
      id: `rec-00${4 + index}`,
      title: `Address ${pattern.theme}`,
      description: pattern.suggestedAction,
      itilPractice: pattern.itilPractice,
      impactRating: pattern.impactRating,
      effortRating: pattern.effortRating,
      priority: 2,
      riskLevel: pattern.frequency > 10 ? 'HIGH' : 'MEDIUM',
    });
  });

  return recommendations;
}

/**
 * Identify critical findings
 */
function identifyCriticalFindings(
  records: ProblemRecord[],
  kpis: KPIData
): CriticalFinding[] {
  const findings: CriticalFinding[] = [];

  // High P1 volume
  if (kpis.p1Proportion > 30) {
    findings.push({
      id: 'find-001',
      title: 'High Critical Problem Volume',
      description: `${kpis.p1Proportion}% of problems are P1 severity, indicating potential systemic issues.`,
      severity: 'CRITICAL',
      affectedRecords: Math.round((kpis.totalRecords * kpis.p1Proportion) / 100),
      recommendedAction: 'Conduct root cause analysis and implement preventive controls',
    });
  }

  // High open count
  if ((kpis.openCount / kpis.totalRecords) * 100 > 40) {
    findings.push({
      id: 'find-002',
      title: 'High Open Problem Count',
      description: `${((kpis.openCount / kpis.totalRecords) * 100).toFixed(1)}% of problems remain open, indicating resolution delays.`,
      severity: 'HIGH',
      affectedRecords: kpis.openCount,
      recommendedAction: 'Increase resolution capacity and review escalation procedures',
    });
  }

  // High reopen rate
  if (kpis.reopenRate > 10) {
    findings.push({
      id: 'find-003',
      title: 'High Problem Reopen Rate',
      description: `${kpis.reopenRate}% of problems are reopened, indicating inadequate root cause resolution.`,
      severity: 'HIGH',
      affectedRecords: Math.round((kpis.totalRecords * kpis.reopenRate) / 100),
      recommendedAction: 'Improve root cause analysis quality and implement verification procedures',
    });
  }

  // Poor MTTR
  if (kpis.mttrEstimate > 120) {
    findings.push({
      id: 'find-004',
      title: 'Excessive Mean Time To Resolution',
      description: `Average resolution time is ${kpis.mttrEstimate} hours, significantly impacting service availability.`,
      severity: 'MEDIUM',
      affectedRecords: kpis.totalRecords,
      recommendedAction: 'Establish SLA-driven response procedures and enhance support resources',
    });
  }

  return findings;
}

/**
 * Generate McKinsey SCR narrative
 */
function generateMcKinseySCR(
  records: ProblemRecord[],
  kpis: KPIData,
  findings: CriticalFinding[]
): McKinseySCR {
  const situation = `The organization is currently managing ${kpis.totalRecords} problems across systems and services. Of these, ${kpis.openCount} (${((kpis.openCount / kpis.totalRecords) * 100).toFixed(1)}%) remain open, with ${kpis.p1Proportion}% classified as critical (P1) severity issues.`;

  const complication = findings.length > 0
    ? `Key challenges include: ${findings.map((f) => f.title.toLowerCase()).join(', ')}. These issues are impacting service availability and user experience.`
    : `Despite proactive management, several systemic challenges persist that require strategic intervention.`;

  const resolution = `Implement a comprehensive Problem Management optimization program focused on: (1) Root cause analysis acceleration, (2) Preventive control establishment, (3) Incident volume reduction through systemic fixes, and (4) Continuous monitoring and improvement cycles. Expected outcomes: 30-40% reduction in repeat problems and improved MTTR by 25-35%.`;

  return { situation, complication, resolution };
}
