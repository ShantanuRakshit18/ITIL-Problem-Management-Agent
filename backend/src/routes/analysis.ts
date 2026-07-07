import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { analysisService } from '../services/analysisService';
import { AnalysisRequest } from '../types';

const router = Router();

// Get full analysis for uploaded file
router.post(
  '/full',
  asyncHandler(async (req: Request, res: Response) => {
    const { fileId, fileName } = req.body as {
      fileId: string;
      fileName: string;
    };

    if (!fileId || !fileName) {
      throw {
        statusCode: 400,
        code: 'MISSING_PARAMETERS',
        message: 'fileId and fileName are required',
      };
    }

    const result = await analysisService(fileId, fileName);

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  })
);

// Get KPIs only
router.post(
  '/kpis',
  asyncHandler(async (req: Request, res: Response) => {
    const { fileId, fileName } = req.body as {
      fileId: string;
      fileName: string;
    };

    if (!fileId || !fileName) {
      throw {
        statusCode: 400,
        code: 'MISSING_PARAMETERS',
        message: 'fileId and fileName are required',
      };
    }

    const analysis = await analysisService(fileId, fileName);

    res.status(200).json({
      success: true,
      data: {
        kpis: analysis.kpis,
        severityDistribution: analysis.severityDistribution,
      },
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;
