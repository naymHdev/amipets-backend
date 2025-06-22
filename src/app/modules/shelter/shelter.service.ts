import { ISurvey } from './shelter.interface';
import { Survey } from './shelter.model';

const createSurveyFromDB = async (payload: ISurvey) => {
  const result = await Survey.create(payload);
  return result;
};

const getSurveyFromDB = async () => {
  const result = await Survey.find();
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
