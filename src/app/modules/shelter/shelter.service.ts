import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import Pet from '../pet/pet.model';
import { ISurvey } from './shelter.interface';
import { Survey } from './shelter.model';

const createSurveyFromDB = async (payload: ISurvey) => {
  const result = await Survey.create(payload);
  return result;
};

const getSurveyFromDB = async (petId : string) => {
  const pet = await Pet.findById(petId);
  if(!pet){
    throw new AppError(StatusCodes.NOT_FOUND, 'Pet not found');
  }

  const result = await Survey.find({shelter_owner : pet?.owner});
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

export const ShelterServices = {
  createSurveyFromDB,
  getSurveyFromDB,
  deleteSurvey,
  getSingleSurveyFromDB,
  updateSurvey,
};
