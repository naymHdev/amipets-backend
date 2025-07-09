import catchAsync from '../../utils/catchAsync';
import { DashboardService } from './dashboard.service';

//  -------------------------------------- Admin Dashboard --------------------------------------
const dbTotalStats = catchAsync(async (req, res) => {
  const result = await DashboardService.dbTotalStats();
  res.status(200).json({
    success: true,
    message: 'Dashboard status fetched successfully',
    statusCode: 200,
    data: result,
  });
});

const dashboardUsersStats = catchAsync(async (req, res) => {
  const filterYear = Number(req.query.year) || new Date().getFullYear();

  const result = await DashboardService.getDashboardUsersStats(filterYear);

  res.status(200).json({
    success: true,
    message: 'Dashboard status fetched successfully',
    statusCode: 200,
    data: result,
  });
});

const dbShelterStats = catchAsync(async (req, res) => {
  const filterYear = Number(req.query.year) || new Date().getFullYear();

  const result = await DashboardService.getDashboardShelterStats(filterYear);
  res.status(200).json({
    success: true,
    message: 'Dashboard status fetched successfully',
    statusCode: 200,
    data: result,
  });
});

//  -------------------------------------- Shelter Dashboard --------------------------------------

export const DashboardController = {
  dashboardUsersStats,
  dbShelterStats,
  dbTotalStats,
};
