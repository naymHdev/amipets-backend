import User from '../auth/auth.model';
import Pet from '../pet/pet.model';

//  -------------------------------------- Admin Dashboard Start --------------------------------------
const dbTotalStats = async () => {
  const totalUser = await User.countDocuments();
  const totalShelter = await User.countDocuments({ role: 'shelter' });
  const totalPet = await Pet.countDocuments();
  return { totalUser, totalShelter, totalPet };
};

const getDashboardUsersStats = async (filterYear: number) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Filtered total counts for the selected year
  const startOfYear = new Date(`${filterYear}-01-01`);
  const endOfYear = new Date(`${filterYear + 1}-01-01`);

  const totalUser = await User.countDocuments({
    createdAt: { $gte: startOfYear, $lt: endOfYear },
  });

  const totalShelter = await User.countDocuments({
    role: 'shelter',
    createdAt: { $gte: startOfYear, $lt: endOfYear },
  });

  const totalPet = await Pet.countDocuments({
    createdAt: { $gte: startOfYear, $lt: endOfYear },
  });

  // Monthly User Stats
  const allMonthUserStats = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear, $lt: endOfYear },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);

  // Initialize response objects
  const monthlyJoinedUser: Record<string, number> = {};

  monthNames.forEach((month) => {
    monthlyJoinedUser[month] = 0;
  });

  allMonthUserStats.forEach((item) => {
    const monthName = monthNames[item._id.month - 1];
    monthlyJoinedUser[monthName] = item.count;
  });

  return {
    totalUser,
    totalShelter,
    totalPet,
    filterYear,
    monthlyJoinedUser,
  };
};

const getDashboardShelterStats = async (filterYear: number) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Filtered total counts for the selected year
  const startOfYear = new Date(`${filterYear}-01-01`);
  const endOfYear = new Date(`${filterYear + 1}-01-01`);

  const totalUser = await User.countDocuments({
    createdAt: { $gte: startOfYear, $lt: endOfYear },
  });

  const totalShelter = await User.countDocuments({
    role: 'shelter',
    createdAt: { $gte: startOfYear, $lt: endOfYear },
  });

  const totalPet = await Pet.countDocuments({
    createdAt: { $gte: startOfYear, $lt: endOfYear },
  });

  // Monthly Shelter Stats
  const allMonthShelterStats = await User.aggregate([
    {
      $match: {
        role: 'shelter',
        createdAt: { $gte: startOfYear, $lt: endOfYear },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);

  // Initialize response objects
  const monthlyJoinedUser: Record<string, number> = {};
  const monthlyJoinedShelter: Record<string, number> = {};

  monthNames.forEach((month) => {
    monthlyJoinedUser[month] = 0;
    monthlyJoinedShelter[month] = 0;
  });

  allMonthShelterStats.forEach((item) => {
    const monthName = monthNames[item._id.month - 1];
    monthlyJoinedShelter[monthName] = item.count;
  });

  return {
    totalUser,
    totalShelter,
    totalPet,
    filterYear,
    monthlyJoinedShelter,
  };
};

//  -------------------------------------- Admin Dashboard End --------------------------------------

//  -------------------------------------- Shelter Dashboard Start --------------------------------------

const shelterTotalStats = async () => {
  const totalShelter = await User.countDocuments({ role: 'shelter' });
  const totalPet = await Pet.countDocuments();
  return { totalShelter, totalPet };
};
export const DashboardService = {
  getDashboardUsersStats,
  getDashboardShelterStats,
  dbTotalStats,

  //  -------------------------------------- Shelter Dashboard --------------------------------------
  shelterTotalStats,
};
