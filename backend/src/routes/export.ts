import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { generatePDFReport, generatePPTReport, generateExcelReport } from '../services/reportService';

const router = Router();

// Export as PDF
router.post(
  '/pdf',
  asyncHandler(async (req: Request, res: Response) => {
    const { analysisData } = req.body;

    if (!analysisData) {
      throw {
        statusCode: 400,
        code: 'MISSING_DATA',
        message: 'analysisData is required',
      };
    }

    const pdfBuffer = await generatePDFReport(analysisData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="itil-analysis-report.pdf"'
    );
    res.send(pdfBuffer);
  })
);

// Export as PowerPoint
router.post(
  '/ppt',
  asyncHandler(async (req: Request, res: Response) => {
    const { analysisData } = req.body;

    if (!analysisData) {
      throw {
        statusCode: 400,
        code: 'MISSING_DATA',
        message: 'analysisData is required',
      };
    }

    const pptBuffer = await generatePPTReport(analysisData);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="itil-analysis-report.pptx"'
    );
    res.send(pptBuffer);
  })
);

// Export as Excel
router.post(
  '/excel',
  asyncHandler(async (req: Request, res: Response) => {
    const { analysisData } = req.body;

    if (!analysisData) {
      throw {
        statusCode: 400,
        code: 'MISSING_DATA',
        message: 'analysisData is required',
      };
    }

    const excelBuffer = await generateExcelReport(analysisData);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="itil-analysis-report.xlsx"'
    );
    res.send(excelBuffer);
  })
);

export default router;
