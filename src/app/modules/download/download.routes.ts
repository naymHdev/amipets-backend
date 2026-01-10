import { Router } from 'express';
import { DownloadController } from './download.controller';

const router = Router();

router.post('/download-throw-url', DownloadController.downloadThrowUrl);

export const DownloadRoutes = router;
