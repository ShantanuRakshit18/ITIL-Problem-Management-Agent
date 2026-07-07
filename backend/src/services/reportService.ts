import jsPDF from 'jspdf';
import { AnalysisResult } from '../types';

/**
 * Generate PDF report from analysis data
 */
export async function generatePDFReport(analysisData: AnalysisResult): Promise<Buffer> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let yPosition = margin;

  // Title Page
  pdf.setFontSize(24);
  pdf.text('ITIL Problem Management', margin, yPosition);
  pdf.text('Analysis Report', margin, yPosition + 10);

  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  yPosition += 30;
  pdf.text(`Report Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
  pdf.text(`File: ${analysisData.fileName}`, margin, yPosition + 5);
  pdf.text(`Records Analyzed: ${analysisData.kpis.totalRecords}`, margin, yPosition + 10);

  // McKinsey SCR Section
  pdf.addPage();
  yPosition = margin;
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Executive Summary', margin, yPosition);

  yPosition += 12;
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'bold');
  pdf.text('Situation', margin, yPosition);
  pdf.setFont(undefined, 'normal');
  yPosition += 6;
  const situationLines = pdf.splitTextToSize(analysisData.mckinseySCR.situation, pageWidth - 2 * margin);
  pdf.text(situationLines, margin, yPosition);
  yPosition += situationLines.length * 4 + 5;

  pdf.setFont(undefined, 'bold');
  pdf.text('Complication', margin, yPosition);
  pdf.setFont(undefined, 'normal');
  yPosition += 6;
  const complicationLines = pdf.splitTextToSize(analysisData.mckinseySCR.complication, pageWidth - 2 * margin);
  pdf.text(complicationLines, margin, yPosition);
  yPosition += complicationLines.length * 4 + 5;

  pdf.setFont(undefined, 'bold');
  pdf.text('Resolution', margin, yPosition);
  pdf.setFont(undefined, 'normal');
  yPosition += 6;
  const resolutionLines = pdf.splitTextToSize(analysisData.mckinseySCR.resolution, pageWidth - 2 * margin);
  pdf.text(resolutionLines, margin, yPosition);

  // KPI Page
  pdf.addPage();
  yPosition = margin;
  pdf.setFontSize(16);
  pdf.text('Key Performance Indicators', margin, yPosition);
  yPosition += 15;

  // KPI Cards
  const kpiData = [
    { label: 'Total Records', value: analysisData.kpis.totalRecords.toString() },
    { label: 'Open Count', value: analysisData.kpis.openCount.toString() },
    { label: 'Closed Count', value: analysisData.kpis.closedCount.toString() },
    { label: 'Health Score', value: `${analysisData.kpis.healthScore}/100` },
    { label: 'MTTR (hours)', value: analysisData.kpis.mttrEstimate.toString() },
    { label: 'P1 Proportion (%)', value: analysisData.kpis.p1Proportion.toFixed(2) },
    { label: 'Reopen Rate (%)', value: analysisData.kpis.reopenRate.toFixed(2) },
    { label: 'Proactive/Reactive Ratio', value: analysisData.kpis.proactiveReactiveRatio.toFixed(2) },
  ];

  pdf.setFontSize(10);
  let col = 0;
  let row = 0;
  kpiData.forEach((kpi, index) => {
    const xPos = margin + col * (pageWidth / 2 - margin);
    const yPos = yPosition + row * 15;

    pdf.setDrawColor(200, 200, 200);
    pdf.rect(xPos, yPos, pageWidth / 2 - 2 * margin, 12);

    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(9);
    pdf.text(kpi.label, xPos + 2, yPos + 5);
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(11);
    pdf.text(kpi.value, xPos + 2, yPos + 10);

    col++;
    if (col === 2) {
      col = 0;
      row++;
    }
  });

  // Severity Distribution
  pdf.addPage();
  yPosition = margin;
  pdf.setFontSize(16);
  pdf.text('Severity Distribution', margin, yPosition);
  yPosition += 15;

  const severityData = [
    ['P1', analysisData.severityDistribution.p1.toString()],
    ['P2', analysisData.severityDistribution.p2.toString()],
    ['P3', analysisData.severityDistribution.p3.toString()],
    ['P4', analysisData.severityDistribution.p4.toString()],
  ];

  pdf.setFontSize(10);
  severityData.forEach((row, index) => {
    const yPos = yPosition + index * 8;
    pdf.text(`${row[0]}: ${row[1]} problems`, margin, yPos);
    const barWidth = (parseInt(row[1]) / analysisData.kpis.totalRecords) * 100;
    pdf.setDrawColor(200, 0, 0);
    pdf.rect(margin + 15, yPos - 3, barWidth, 4, 'F');
  });

  // Root Cause Analysis
  pdf.addPage();
  yPosition = margin;
  pdf.setFontSize(16);
  pdf.text('Root Cause Intelligence', margin, yPosition);
  yPosition += 12;

  pdf.setFontSize(9);
  pdf.setFont(undefined, 'bold');
  pdf.text('Cause', margin, yPosition);
  pdf.text('Frequency', margin + 80, yPosition);
  pdf.text('Severity', margin + 120, yPosition);
  pdf.setFont(undefined, 'normal');
  yPosition += 6;

  analysisData.rootCauseIntelligence.slice(0, 15).forEach((cause) => {
    pdf.text(cause.cause.substring(0, 40), margin, yPosition);
    pdf.text(cause.frequency.toString(), margin + 80, yPosition);
    pdf.text(cause.severity, margin + 120, yPosition);
    yPosition += 5;

    if (yPosition > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  });

  // Critical Findings
  pdf.addPage();
  yPosition = margin;
  pdf.setFontSize(16);
  pdf.text('Critical Findings', margin, yPosition);
  yPosition += 12;

  analysisData.criticalFindings.forEach((finding) => {
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(
      finding.severity === 'CRITICAL' ? 255 : finding.severity === 'HIGH' ? 200 : 100,
      0,
      0
    );
    pdf.text(`● ${finding.title}`, margin, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(9);
    yPosition += 5;

    const descLines = pdf.splitTextToSize(finding.description, pageWidth - 2 * margin - 5);
    pdf.text(descLines, margin + 5, yPosition);
    yPosition += descLines.length * 4 + 3;

    pdf.text(`Affected Records: ${finding.affectedRecords}`, margin + 5, yPosition);
    yPosition += 5;

    const actionLines = pdf.splitTextToSize(
      `Recommended Action: ${finding.recommendedAction}`,
      pageWidth - 2 * margin - 5
    );
    pdf.text(actionLines, margin + 5, yPosition);
    yPosition += actionLines.length * 4 + 8;

    if (yPosition > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  });

  // Strategic Recommendations
  pdf.addPage();
  yPosition = margin;
  pdf.setFontSize(16);
  pdf.text('Strategic Recommendations', margin, yPosition);
  yPosition += 12;

  analysisData.strategicRecommendations.forEach((rec) => {
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.text(`[P${rec.priority}] ${rec.title}`, margin, yPosition);
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(9);
    yPosition += 5;

    pdf.text(`ITIL Practice: ${rec.itilPractice}`, margin + 3, yPosition);
    pdf.text(
      `Impact: ${rec.impactRating} | Effort: ${rec.effortRating}`,
      margin + 3,
      yPosition + 4
    );
    yPosition += 8;

    const descLines = pdf.splitTextToSize(rec.description, pageWidth - 2 * margin - 5);
    pdf.text(descLines, margin + 3, yPosition);
    yPosition += descLines.length * 4 + 5;

    if (yPosition > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  });

  return Buffer.from(pdf.output('arraybuffer'));
}

/**
 * Generate PowerPoint report from analysis data
 */
export async function generatePPTReport(analysisData: AnalysisResult): Promise<Buffer> {
  // Note: This is a simplified stub. In production, use a proper library like pptxgen-js
  // For now, returning a PDF as PPT placeholder
  return generatePDFReport(analysisData);
}

/**
 * Generate Excel report from analysis data
 */
export async function generateExcelReport(analysisData: AnalysisResult): Promise<Buffer> {
  // Note: This is a simplified stub. In production, use a proper library like xlsx
  // For now, returning a PDF as Excel placeholder
  return generatePDFReport(analysisData);
}
