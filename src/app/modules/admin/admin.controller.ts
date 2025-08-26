import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';
import config from '../../config';
import { IJwtPayload } from '../auth/auth.interface';
import { Service } from './admin.model';
import { NotificationService } from '../notification/notification.service';

const createAbout = catchAsync(async (req, res) => {
  const result = await AdminService.createAboutFromDB(req.body);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `${req.user?.first_name} ${req.user?.last_name} created about section`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    message: 'About section created successfully',
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const getAbout = catchAsync(async (req, res) => {
  const result = await AdminService.getABoutFromDB();

  sendResponse(res, {
    success: true,
    message: 'About section fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updateAbout = catchAsync(async (req, res) => {
  const result = await AdminService.updateAbout(req.body);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} updated about section`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    message: 'About section updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const createPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await AdminService.createPrivacyPolicyFromDB(req.body);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} created privacy policy`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    message: 'Privacy policy created successfully',
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const getPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await AdminService.getPrivacyPolicyFromDB();

  sendResponse(res, {
    success: true,
    message: 'Privacy policy fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updatePrivacyPolicy = catchAsync(async (req, res) => {
  const result = await AdminService.updatePrivacyPolicy(req.body);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} updated privacy policy`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    message: 'Privacy policy updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const createTermsAndCondition = catchAsync(async (req, res) => {
  const result = await AdminService.createTermsOfServiceFromDB(req.body);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} created terms and condition`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });
  sendResponse(res, {
    success: true,
    message: 'Terms and condition created successfully',
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const getTermsAndCondition = catchAsync(async (req, res) => {
  const result = await AdminService.getTermsOfServiceFromDB();

  sendResponse(res, {
    success: true,
    message: 'Terms and condition fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updateTermsAndCondition = catchAsync(async (req, res) => {
  const result = await AdminService.updateTermsOfService(req.body);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} updated terms and condition`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });
  sendResponse(res, {
    success: true,
    message: 'Terms and condition updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

// --------------------------------- Banner Controller ---------------------------------
const createBanner = catchAsync(async (req, res) => {
  const payload = req.body;
  const files = req.files as Express.Multer.File[];

  const image = files.map((file) => {
    return (
      (file?.filename && config.BASE_URL + '/images/' + file.filename) || ''
    );
  });
  const result = await AdminService.createBannerFromDB(payload, image);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `${req.user?.email?.split('@')[0]} updated banner`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });
  sendResponse(res, {
    success: true,
    message: 'Banner created successfully',
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const getBanner = catchAsync(async (req, res) => {
  const result = await AdminService.getBannerFromDB();

  sendResponse(res, {
    success: true,
    message: 'Banner fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updateBanner = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const files = req.files as Express.Multer.File[];

  const image = files.map((file) => {
    return (
      (file?.filename && config.BASE_URL + '/images/' + file.filename) || ''
    );
  });

  const result = await AdminService.updateBanner(payload, image, id);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `${req.user?.email?.split('@')[0]} updated banner`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });
  sendResponse(res, {
    success: true,
    message: 'Banner updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const deleteSingleBannerInfo = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminService.deleteSingleBannerInfo(id);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} deleted banner info. Deleted time ${new Date().toLocaleString()}`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    message: 'Banner info deleted successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

// ----------------------------- Services Controller ----------------------------
const createService = catchAsync(async (req, res) => {
  const payload = req.body;
  const icon =
    (req.file?.filename && config.BASE_URL + '/images/' + req.file.filename) ||
    '';
  const result = await AdminService.createServiceFromDB(payload, icon);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} created service`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    success: true,
    message: 'Service created successfully',
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const getService = catchAsync(async (req, res) => {
  const result = await AdminService.getServiceFromDB(req.query);

  sendResponse(res, {
    success: true,
    message: 'Service fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const getSingleService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.getSingleServices(id);

  sendResponse(res, {
    success: true,
    message: 'Service fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updateService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const icon =
    (req.file?.filename && config.BASE_URL + '/images/' + req.file.filename) ||
    '';
  const result = await AdminService.updateService(id, payload, icon);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} updated service`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });
  sendResponse(res, {
    success: true,
    message: 'Service updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const deletedService = catchAsync(async (req, res) => {
  const { id } = req.params;
  await AdminService.deleteService(id);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: null,
      message: `${req.user?.first_name} ${req.user?.last_name} deleted service`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });
  sendResponse(res, {
    success: true,
    message: 'Service deleted successfully',
    statusCode: StatusCodes.OK,
    data: null,
  });
});

// -------------------------------- Add Website Controller --------------------------------
const createAddWebsite = catchAsync(async (req, res) => {
  const payload = req.body;
  const web_img =
    (req.file?.filename && config.BASE_URL + '/images/' + req.file.filename) ||
    '';

  const service = await Service.findById(req.body.service);
  const serviceName = service?.name;
  const result = await AdminService.createWebsiteFromDB(
    payload,
    web_img,
    serviceName as string,
  );

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.email.split('@')[0]} created website`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });
  sendResponse(res, {
    success: true,
    message: 'Website added successfully',
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const updateAddWebsite = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const web_img =
    (req.file?.filename && config.BASE_URL + '/images/' + req.file.filename) ||
    '';

  const result = await AdminService.updateWebFromDB(id, payload, web_img);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} updated website`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });
  sendResponse(res, {
    success: true,
    message: 'Website updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const getAddWebsite = catchAsync(async (req, res) => {
  const result = await AdminService.getWebsiteFromDB(req.query);

  sendResponse(res, {
    success: true,
    message: 'Website fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const getAddWebsiteDetail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.getWebDetailFromDB(id);

  sendResponse(res, {
    success: true,
    message: 'Website fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const deletedAddWebsite = catchAsync(async (req, res) => {
  const { id } = req.params;
  await AdminService.deleteWebsite(id);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: null,
      message: `  ${req.user?.first_name} ${req.user?.last_name} deleted website`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });
  sendResponse(res, {
    success: true,
    message: 'Website deleted successfully',
    statusCode: StatusCodes.OK,
    data: null,
  });
});

const serviceBaseWeb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.getServiceBaseWeb(id, req.query);

  sendResponse(res, {
    success: true,
    message: 'Website fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const swapPosition = catchAsync(async (req, res) => {
  const { pos1, pos2 } = req.body;

  const result = await AdminService.swapPosition(pos1, pos2);

  sendResponse(res, {
    success: true,
    message: 'Position swapped successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const getWebLocations = catchAsync(async (req, res) => {
  const result = await AdminService.getWebLocations();
  sendResponse(res, {
    success: true,
    message: 'Locations fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

// ---------------------------- Users Controller ----------------------------
const getAllUsers = catchAsync(async (req, res) => {
  const result = await AdminService.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users fetched successfully!',
    data: result,
  });
});

const getUserDetail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.getUserDetailFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User fetched successfully!',
    data: result,
  });
});

const blockUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  await AdminService.blockUser(id);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: null,
      message: ` ${req.user?.first_name} ${req.user?.last_name} blocked user`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User blocked successfully!',
    data: null,
  });
});

const unblockUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  await AdminService.unblockUser(id);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: null,
      message: ` ${req.user?.first_name} ${req.user?.last_name} unblocked user`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User unblocked successfully!',
    data: null,
  });
});

// ---------------------------- Shelter Controller ----------------------------
const getAllShelter = catchAsync(async (req, res) => {
  const result = await AdminService.getAllSheltersFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Shelters fetched successfully!',
    data: result,
  });
});

const getShelterDetail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.shelterDetailFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Shelter fetched successfully!',
    data: result,
  });
});

const blockShelter = catchAsync(async (req, res) => {
  const { id } = req.params;
  await AdminService.blockShelter(id);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: null,
      message: ` ${req.user?.first_name} ${req.user?.last_name} blocked shelter`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Shelter blocked successfully!',
    data: null,
  });
});

// ----------------------------- Admin Profile Controller ----------------------------
const editAdminProfile = catchAsync(async (req, res) => {
  const profile_image =
    (req.file?.filename && config.BASE_URL + '/images/' + req.file.filename) ||
    '';
  const result = await AdminService.editProfileFromDB(
    req.user as IJwtPayload,
    req.body,
    profile_image,
  );

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} updated admin profile`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin profile updated successfully!',
    data: result,
  });
});

const adminProfile = catchAsync(async (req, res) => {
  const result = await AdminService.adminProfile(req.user as IJwtPayload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin profile fetched successfully!',
    data: result,
  });
});

// ----------------------------- Export Controller ----------------------------
export const AdminController = {
  createAbout,
  createPrivacyPolicy,
  createTermsAndCondition,
  getAbout,
  getPrivacyPolicy,
  getTermsAndCondition,
  updateAbout,
  updatePrivacyPolicy,
  updateTermsAndCondition,

  createBanner,
  getBanner,
  updateBanner,
  deleteSingleBannerInfo,

  createService,
  getService,
  updateService,
  deletedService,
  getSingleService,
  serviceBaseWeb,
  getWebLocations,

  createAddWebsite,
  getAddWebsite,
  deletedAddWebsite,
  getAddWebsiteDetail,
  swapPosition,
  updateAddWebsite,

  getAllUsers,
  getUserDetail,
  blockUser,
  unblockUser,

  editAdminProfile,
  adminProfile,
  getAllShelter,
  getShelterDetail,
  blockShelter,
};
