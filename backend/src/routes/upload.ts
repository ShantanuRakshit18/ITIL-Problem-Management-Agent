import { Router, Request, Response } from 'express';
import { uploadMiddleware } from '../middleware/fileUpload';
import { asyncHandler } from '../middleware/errorHandler';
import { uploadFileService } from '../services/fileService';
import { UploadResponse } from '../types';

const router = Router();

// Single file upload endpoint
router.post(
  '/single',
  uploadMiddleware.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw {
        statusCode: 400,
        code: 'NO_FILE_UPLOADED',
        message: 'No file uploaded',
      };
    }

    const result = await uploadFileService(req.file);

    const response: UploadResponse = {
      success: true,
      message: 'File uploaded and validated successfully',
      recordCount: result.recordCount,
      fileName: result.fileName,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  })
);

// Multiple file upload endpoint
router.post(
  '/multiple',
  uploadMiddleware.array('files', 5),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      throw {
        statusCode: 400,
        code: 'NO_FILES_UPLOADED',
        message: 'No files uploaded',
      };
    }

    const uploadedFiles = req.files as Express.Multer.File[];
    const results = await Promise.all(
      uploadedFiles.map((file) => uploadFileService(file))
    );

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      files: results,
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;
