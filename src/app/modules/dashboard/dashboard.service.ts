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

const findRecentAdopters = async (
  shelterId: string,
  query: Record<string, unknown>,
) => {
  const { ...pQuery } = query;

  const adoptedPets = PetAdopt.find()
    .populate('adopter')
    .populate('adopted_pet')
    .populate({
      path: 'adopted_pet',
      populate: {
        path: 'owner',
      },
    });

  const petsQuery = new QueryBuilder(adoptedPets, pQuery)
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await petsQuery.modelQuery;

  // Type-safe filtering
  const isOwner = result?.filter((item) => {
    const adoptedPet = item.adopted_pet as any;

    console.log('adoptedPet', adoptedPet);

    if (adoptedPet && typeof adoptedPet === 'object' && 'owner' in adoptedPet) {
      const ownerId = adoptedPet.owner?._id?.toString();
      return ownerId === shelterId.toString();
    }

    return false;
  });

  const meta = await petsQuery.countTotal();

  return {
    meta,
    data: isOwner,
  };
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
};
