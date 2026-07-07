import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import csv from 'csv-parser';
import { ProblemRecord } from '../types';

/**
 * Parse CSV file and extract problem records
 */
function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

/**
 * Parse Excel file and extract problem records
 */
function parseExcel(filePath: string): any[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
}

/**
 * Normalize column names (handle variations in ServiceNow exports)
 */
function normalizeColumnNames(record: any): any {
  const normalized: any = {};

  // Define column mapping patterns
  const columnMappings: { [key: string]: string[] } = {
    problemId: ['problem_id', 'problemid', 'problem id', 'id', 'number'],
    severity: ['severity', 'priority', 'impact'],
    category: ['category', 'category_id', 'problem_category'],
    rootCause: ['root_cause', 'rootcause', 'root cause', 'cause'],
    executiveSummary: ['executive_summary', 'summary', 'short_description', 'title', 'description'],
    status: ['status', 'state'],
    closureNotes: ['closure_notes', 'closurenotes', 'close_notes', 'resolution_notes', 'notes'],
    createdDate: ['created_date', 'createddate', 'created_on', 'opened_at'],
    closedDate: ['closed_date', 'closeddate', 'closed_on', 'resolved_at'],
    reopenCount: ['reopen_count', 'reopencount', 'number_of_reopens'],
    assignedTo: ['assigned_to', 'assignedto', 'owner'],
  };

  // Map fields
  for (const [normalizedKey, patterns] of Object.entries(columnMappings)) {
    for (const pattern of patterns) {
      for (const [key, value] of Object.entries(record)) {
        if (key.toLowerCase() === pattern.toLowerCase()) {
          normalized[normalizedKey] = value;
          break;
        }
      }
      if (normalized[normalizedKey]) break;
    }
  }

  return normalized;
}

/**
 * Convert string values to proper types
 */
function normalizeProblemRecord(record: any): Partial<ProblemRecord> {
  const normalized = normalizeColumnNames(record);

  return {
    problemId: String(normalized.problemId || '').trim(),
    severity: normalizeString(normalized.severity, ['P1', 'P2', 'P3', 'P4']),
    category: String(normalized.category || '').trim(),
    rootCause: String(normalized.rootCause || '').trim(),
    executiveSummary: String(normalized.executiveSummary || '').trim(),
    status: normalizeStatus(String(normalized.status || '')),
    closureNotes: String(normalized.closureNotes || '').trim(),
    createdDate: parseDate(normalized.createdDate),
    closedDate: normalized.closedDate ? parseDate(normalized.closedDate) : undefined,
    reopenCount: parseInt(normalized.reopenCount) || 0,
    assignedTo: String(normalized.assignedTo || '').trim() || undefined,
  };
}

/**
 * Normalize severity strings
 */
function normalizeString(value: any, validOptions: string[]): any {
  const str = String(value || '').toUpperCase().trim();
  return validOptions.find((opt) => str.includes(opt)) || 'P4';
}

/**
 * Normalize status strings
 */
function normalizeStatus(value: string): 'Open' | 'Closed' | 'On Hold' | 'Reopened' {
  const status = value.toLowerCase().trim();
  if (status.includes('close')) return 'Closed';
  if (status.includes('hold')) return 'On Hold';
  if (status.includes('reopen')) return 'Reopened';
  return 'Open';
}

/**
 * Parse date string to Date object
 */
function parseDate(value: any): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  try {
    return new Date(value);
  } catch {
    return new Date();
  }
}

/**
 * Main file service: upload and parse ServiceNow data
 */
export async function uploadFileService(
  file: Express.Multer.File
): Promise<{ fileName: string; recordCount: number; fileId: string }> {
  if (!file) {
    throw {
      statusCode: 400,
      code: 'NO_FILE',
      message: 'No file provided',
    };
  }

  const ext = path.extname(file.filename).toLowerCase();
  let rawRecords: any[] = [];

  try {
    // Parse file based on extension
    if (ext === '.csv') {
      rawRecords = await parseCSV(file.path);
    } else if (['.xlsx', '.xls'].includes(ext)) {
      rawRecords = parseExcel(file.path);
    } else {
      throw {
        statusCode: 400,
        code: 'INVALID_FILE_TYPE',
        message: 'Only CSV and Excel files are supported',
      };
    }

    if (rawRecords.length === 0) {
      throw {
        statusCode: 400,
        code: 'EMPTY_FILE',
        message: 'File contains no data records',
      };
    }

    // Normalize records
    const normalizedRecords = rawRecords
      .map((record, index) => ({
        id: `${Date.now()}-${index}`,
        ...normalizeProblemRecord(record),
      }))
      .filter((record) => record.problemId); // Filter out records without ID

    // Store in memory (in production, use database)
    (global as any).uploadedData = {
      [file.filename]: normalizedRecords,
    };

    return {
      fileName: file.originalname,
      recordCount: normalizedRecords.length,
      fileId: file.filename,
    };
  } catch (error: any) {
    // Clean up uploaded file on error
    fs.unlink(file.path, () => {});
    throw error;
  }
}

/**
 * Retrieve uploaded data
 */
export function getUploadedData(fileId: string): ProblemRecord[] {
  const data = (global as any).uploadedData?.[fileId] || [];
  return data;
}
