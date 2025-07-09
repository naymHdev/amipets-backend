import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import Pet from '../pet/pet.model';
import { ISurvey } from './shelter.interface';
import { Survey } from './shelter.model';
import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';

const createSurveyFromDB = async (payload: ISurvey, userId: string) => {
  payload.shelter_owner = new Types.ObjectId(userId);

  const result = await Survey.create(payload);
  return result;
};

const getSurveyFromDB = async (petId: string) => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Your question not found!');
  }

  const result = await Survey.find({ shelter_owner: pet?.owner }).populate(
    'shelter_owner',
  );
  return result;
};

const getSingleSurveyFromDB = async (id: string) => {
  const result = await Survey.findById(id);
  return result;
};

const deleteSurvey = async (id: string) => {
  const result = await Survey.findByIdAndDelete(id);
  return result;
};

const updateSurvey = async (id: string, payload: ISurvey) => {
  const result = await Survey.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const mySurveyQs = async (userId: string, query: Record<string, unknown>) => {
  const { ...pQuery } = query;

  const baseQuery = Survey.find({ shelter_owner: userId });

  const petsQuery = new QueryBuilder(baseQuery, pQuery)
    .filter()
    .sort()
    .fields();

  const result = await petsQuery.modelQuery;

  return {
    data: result,
  };
};

const updateUserRequest = async (id: string, payload: ISurvey) => {
  // console.log('payload', payload, 'id______', id);

  const result = await Survey.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    {
      new: true,
      runValidators: true,
    },
  );

  console.log('result', result);

  return result;
};

export const ShelterServices = {
  createSurveyFromDB,
  getSurveyFromDB,
  deleteSurvey,
  getSingleSurveyFromDB,
  updateSurvey,
  mySurveyQs,
  updateUserRequest,
};
