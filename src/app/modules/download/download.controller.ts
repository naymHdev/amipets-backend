import catchAsync from '../../utils/catchAsync';
import { DownloadService } from './download.service';

const downloadThrowUrl = catchAsync(async (req, res) => {
  const { url } = req.body;
  await DownloadService.downloadThrowUrl(url, res);
});

export const DownloadController = {
  downloadThrowUrl,
};
