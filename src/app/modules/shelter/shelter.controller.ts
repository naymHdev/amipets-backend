import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ShelterServices } from './shelter.service';

const createSurvey = catchAsync(async (req, res) => {
  const result = await ShelterServices.createSurveyFromDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Survey question created successfully',
    data: result,
  });
});

const getSurvey = catchAsync(async (req, res) => {
  const result = await ShelterServices.getSurveyFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Survey question fetched successfully',
    data: result,
  });
});

const getSingleSurveyFromDB = catchAsync(async (req, res) => {
  const result = await ShelterServices.getSingleSurveyFromDB(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Survey question fetched successfully',
    data: result,
  });
});

const deleteSurvey = catchAsync(async (req, res) => {
  const result = await ShelterServices.deleteSurvey(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Survey question deleted successfully',
    data: result,
  });
});

const updateSurvey = catchAsync(async (req, res) => {
  const result = await ShelterServices.updateSurvey(req.params.id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Survey question updated successfully',
    data: result,
  });
});

export const ShelterController = {
  createSurvey,
  getSurvey,
  deleteSurvey,
  getSingleSurveyFromDB,
  updateSurvey,
};
