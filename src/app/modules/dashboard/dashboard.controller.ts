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

const shelterTotalStats = catchAsync(async (req, res) => {

  const shelterId = req?.user?._id as string;

  const result = await DashboardService.shelterTotalStats(shelterId);
  res.status(200).json({
    success: true,
    message: 'Dashboard status fetched successfully',
    statusCode: 200,
    data: result,
  });
});

const petsOverView = catchAsync(async (req, res) => {
  const userId = req?.user?._id as string;

  const filterYear = Number(req.query.year) || new Date().getFullYear();

  const result = await DashboardService.petsOverView(filterYear, userId);
  res.status(200).json({
    success: true,
    message: 'Dashboard pets overview fetched successfully',
    statusCode: 200,
    data: result,
  });
});

const petsDonetsOverView = catchAsync(async (req, res) => {
  const userId = req?.user?._id as string;
  const filterYear = Number(req.query.year) || new Date().getFullYear();

  const result = await DashboardService.petsDonetsOverView(filterYear, userId);
  res.status(200).json({
    success: true,
    message: 'Dashboard pets overview fetched successfully',
    statusCode: 200,
    data: result,
  });
});

const findRecentAdopters = catchAsync(async (req, res) => {
  const shelterId = req?.user?._id as string;

  const result = await DashboardService.findRecentAdopters(
    shelterId,
    req.query,
  );
  res.status(200).json({
    success: true,
    message: 'Dashboard pets overview fetched successfully',
    statusCode: 200,
    data: result,
  });
});

const detailsRecentAdopters = catchAsync(async (req, res) => {
  const petId = req.params.id;
  const result = await DashboardService.detailsRecentAdopters(petId as string);

  res.status(200).json({
    success: true,
    message: 'Dashboard pets overview fetched successfully',
    statusCode: 200,
    data: result,
  });
});

export const DashboardController = {
  dashboardUsersStats,
  dbShelterStats,
  dbTotalStats,

  //  -------------------------------------- Shelter Dashboard --------------------------------------
  shelterTotalStats,
  petsOverView,
  petsDonetsOverView,
  findRecentAdopters,
  detailsRecentAdopters,
};
