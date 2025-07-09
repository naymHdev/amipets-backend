import QueryBuilder from '../../builder/QueryBuilder';
import { IIncome } from './earning.interface';
import { Income } from './earning.model';

const addIncomeFromDB = async (data: IIncome): Promise<IIncome> => {
  const result = await Income.create(data);
  return result;
};

const findAllEarnings = async (query: Record<string, unknown>) => {
  const { ...eQuery } = query;

  const earningsQuery = new QueryBuilder(Income.find(), eQuery)
    .search(['clientName', 'transactionDate'])
    .sort()
    .fields()
    .filter()
    .paginate();

  const result = await earningsQuery.modelQuery;
  const meta = await earningsQuery.countTotal();
  return {
    meta,
    data: result,
  };
};

const transactionDetails = async (id: string) => {
  const result = await Income.findById(id);
  return result;
};

const incomeStatus = async () => {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);

  //   Total Earnings
  const totalEarnings = await Income.aggregate([
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$amount' },
      },
    },
  ]);

  // Today's earnings based on transactionDate
  const todayEarningsAgg = await Income.aggregate([
    {
      $match: {
        transactionDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    {
      $group: {
        _id: null,
        todayEarnings: { $sum: '$amount' },
      },
    },
  ]);

  const totalEarning =
    totalEarnings.length > 0 ? totalEarnings[0].totalEarnings : 0;

  const todayEarnings =
    todayEarningsAgg.length > 0 ? todayEarningsAgg[0].todayEarnings : 0;

  return {
    totalEarning,
    todayEarnings,
  };
};

const deletedEarning = async (id: string) => {
  const result = await Income.findByIdAndDelete(id);
  return result;
};

export const EarningService = {
  addIncomeFromDB,
  findAllEarnings,
  transactionDetails,
  incomeStatus,
  deletedEarning,
};
