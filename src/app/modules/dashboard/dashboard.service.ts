import { Types } from 'mongoose';
import User from '../auth/auth.model';
import Pet from '../pet/pet.model';
import { PetAdopt } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';

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
  const monthlyJoinedShelter: Record<string, number> = {};

  monthNames.forEach((month) => {
    monthlyJoinedShelter[month] = 0;
  });

  allMonthShelterStats.forEach((item) => {
    const monthName = monthNames[item._id.month - 1];
    monthlyJoinedShelter[monthName] = item.count;
  });

  return {
    filterYear,
    monthlyJoinedShelter,
  };
};

//  -------------------------------------- Admin Dashboard End --------------------------------------
/* 



*/
//  -------------------------------------- Shelter Dashboard Start --------------------------------------

const shelterTotalStats = async () => {
  const totalPet = await Pet.countDocuments();
  const totalDonations = await Pet.find({ isAdopted: true }).countDocuments();
  return { totalPet, totalPetDonations: totalDonations };
};

const petsOverView = async (filterYear: number, userId: string) => {
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

  // Date range for the given year
  const startOfYear = new Date(`${filterYear}-01-01`);
  const endOfYear = new Date(`${filterYear + 1}-01-01`);

  // ✅ Total pets posted by this user in this year
  const totalPet = await Pet.countDocuments({
    owner: userId,
    createdAt: { $gte: startOfYear, $lt: endOfYear },
  });

  // ✅ Monthly posted pets by this user in this year
  const monthlyPostedStats = await Pet.aggregate([
    {
      $match: {
        owner: new Types.ObjectId(userId), // make sure it's ObjectId
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

  // Initialize monthlyPostPet object
  const monthlyPostPet: Record<string, number> = {};
  monthNames.forEach((month) => {
    monthlyPostPet[month] = 0;
  });

  // Fill in real data
  monthlyPostedStats.forEach((item) => {
    const monthName = monthNames[item._id.month - 1];
    monthlyPostPet[monthName] = item.count;
  });

  return {
    totalPet,
    filterYear,
    monthlyPostPet,
  };
};

const petsDonetsOverView = async (filterYear: number, userId: string) => {
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

  const startOfYear = new Date(`${filterYear}-01-01`);
  const endOfYear = new Date(`${filterYear + 1}-01-01`);

  // ✅ Total donated pets by this shelter owner (isAdopted: true)
  const totalDonatedPets = await Pet.countDocuments({
    owner: userId,
    isAdopted: true,
    createdAt: { $gte: startOfYear, $lt: endOfYear },
  });

  // ✅ Monthly donated pets aggregation
  const monthlyDonatedStats = await Pet.aggregate([
    {
      $match: {
        owner: new Types.ObjectId(userId),
        isAdopted: true,
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

  // Initialize monthlyDonatedPet object
  const monthlyDonatedPet: Record<string, number> = {};
  monthNames.forEach((month) => {
    monthlyDonatedPet[month] = 0;
  });

  // Fill with real data
  monthlyDonatedStats.forEach((item) => {
    const monthName = monthNames[item._id.month - 1];
    monthlyDonatedPet[monthName] = item.count;
  });

  return {
    totalDonatedPets,
    filterYear,
    monthlyDonatedPet,
  };
};

// const findRecentAdopters = async (
//   shelterId: string,
//   query: Record<string, unknown>,
// ) => {
//   const {
//     page = 1,
//     limit = 10,
//     sortBy = 'createdAt',
//     sortOrder = 'desc',
//   } = query;

//   const skip = (Number(page) - 1) * Number(limit);

//   const pipeline: any[] = [
//     {
//       $lookup: {
//         from: 'pets',
//         localField: 'adopted_pet',
//         foreignField: '_id',
//         as: 'adopted_pet',
//       },
//     },
//     { $unwind: '$adopted_pet' },
//     {
//       $lookup: {
//         from: 'users',
//         localField: 'adopted_pet.owner',
//         foreignField: '_id',
//         as: 'adopted_pet.owner',
//       },
//     },
//     { $unwind: '$adopted_pet.owner' },
//     {
//       $match: {
//         'adopted_pet.owner._id': new Types.ObjectId(shelterId),
//       },
//     },
//     {
//       $lookup: {
//         from: 'users',
//         localField: 'adopter',
//         foreignField: '_id',
//         as: 'adopter',
//       },
//     },
//     { $unwind: '$adopter' },

//     // Optional: Filter by search keyword or fields here
//     // Add extra match stage if query includes search fields

//     // Sort stage
//     {
//       $sort: {
//         [sortBy as string]: sortOrder === 'asc' ? 1 : -1,
//       },
//     },

//     // Pagination
//     { $skip: skip },
//     { $limit: Number(limit) },

//     // Projection: Only send needed fields
//     {
//       $project: {
//         _id: 1,
//         adopted_pet: 1,
//         adopter: 1,
//         createdAt: 1,
//         updatedAt: 1,
//       },
//     },
//   ];

//   // Count total for meta
//   const countPipeline = pipeline.slice(
//     0,
//     pipeline.findIndex((stage) => '$sort' in stage),
//   );
//   countPipeline.push({
//     $count: 'total',
//   });

//   const [data, countResult] = await Promise.all([
//     PetAdopt.aggregate(pipeline),
//     PetAdopt.aggregate(countPipeline),
//   ]);

//   const total = countResult[0]?.total || 0;

//   return {
//     meta: {
//       page: Number(page),
//       limit: Number(limit),
//       total,
//     },
//     data,
//   };
// };

const findRecentAdopters = async (
  shelterId: string,
  query: Record<string, unknown>,
) => {
  const { ...pQuery } = query;

  const baseQuery = PetAdopt.find().populate('adopted_pet').populate('adopter');

  const recentAdaptors = new QueryBuilder(baseQuery, pQuery)
    .search([
      'adopted_pet.full_name',
      'adopted_pet.breed',
      'adopted_pet.description',
      'adopted_pet.pet_category',
    ])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await recentAdaptors.modelQuery;
  const meta = await recentAdaptors.countTotal();

  return {
    meta,
    data: result,
  };
};

const detailsRecentAdopters = async (petId: string) => {
  const adopter = await PetAdopt.findById({ _id: petId })
    .populate('adopter')
    .populate('adopted_pet');

  return adopter;
};

export const DashboardService = {
  getDashboardUsersStats,
  getDashboardShelterStats,
  dbTotalStats,

  //  -------------------------------------- Shelter Dashboard --------------------------------------
  shelterTotalStats,
  petsOverView,
  petsDonetsOverView,
  findRecentAdopters,
  detailsRecentAdopters,
};
