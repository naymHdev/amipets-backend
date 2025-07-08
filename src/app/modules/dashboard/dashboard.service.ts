import User from '../auth/auth.model';
import Pet from '../pet/pet.model';

const getDashboardStats = async () => {
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

  const totalUser = await User.countDocuments();
  const totalShelter = await User.find({ role: 'shelter' }).countDocuments();
  const totalPet = await Pet.countDocuments();

  // Get all user join counts grouped by month
  const allMonthUserStats = await User.aggregate([
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.month': 1 },
    },
  ]);

  // Monthly joined shelters only
  const allMonthShelterStats = await User.aggregate([
    {
      $match: {
        role: 'shelter',
      },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.month': 1 },
    },
  ]);

  // Initialize result with all months as 0
  const monthlyJoinedUser: Record<string, number> = {};
  const monthlyJoinedShelter: Record<string, number> = {};

  monthNames.forEach((month) => {
    monthlyJoinedUser[month] = 0;
    monthlyJoinedShelter[month] = 0;
  });

  // Map results from aggregation into the monthlyJoinedUser object
  allMonthUserStats.forEach((item) => {
    const monthIndex = item._id.month - 1;
    const monthName = monthNames[monthIndex];
    monthlyJoinedUser[monthName] = item.count;
  });

  // Populate monthly shelter data
  allMonthShelterStats.forEach((item) => {
    const monthIndex = item._id.month - 1;
    const monthName = monthNames[monthIndex];
    monthlyJoinedShelter[monthName] = item.count;
  });

  return {
    totalUser,
    totalShelter,
    totalPet,
    monthlyJoinedUser,
    monthlyJoinedShelter,
  };
};

export const DashboardService = {
  getDashboardStats,
};
