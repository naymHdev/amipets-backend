import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookmarksService } from './bookmarks.service';
import AppError from '../../errors/appError';
import { NotificationService } from '../notification/notification.service';

const createBookmark = catchAsync(async (req, res) => {
  const userId = req?.user?._id as string;
  const { id: petId } = req.params;

  if (!userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized! ');
  }

  const result = await BookmarksService.createBookmarksFromDB(petId, userId);
  console.log('result_________', result);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?.pet_id,
      message: ` ${req.user?.first_name} ${req.user?.last_name} created bookmark`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?.pet_id,
      message: ` ${req.user?.first_name} ${req.user?.last_name} created bookmark`,
    },
    receiverId: [req.user?._id],
    notifyUser: true,
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: `${result?.isActive ? 'Bookmark added successfully' : 'Bookmark removed successfully'}`,
    data: result,
  });
});

const getAllBookmarks = catchAsync(async (req, res) => {
  const userId = req?.user?._id as string;
  const result = await BookmarksService.getAllBookmarksFromDB(
    userId,
    req.query,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bookmarks fetched successfully',
    data: result,
  });
});

const getAllBookmarkedIds = catchAsync(async (req, res) => {
  const userId = req?.user?._id as string;
  const result = await BookmarksService.getAllBookmarkedIds(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bookmarks fetched successfully',
    data: result,
  });
});

const getDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookmarksService.getDetailsFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bookmark fetched successfully',
    data: result,
  });
});

const deleteBookmarks = catchAsync(async (req, res) => {
  const { id } = req.params;
  await BookmarksService.deletedBookmarksFromDB(id);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: null,
      message: ` ${req.user?.first_name} ${req.user?.last_name} deleted your bookmark`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: null,
      message: `Hay ${req.user?.first_name} ${req.user?.last_name} you deleted bookmark successfully!`,
    },
    receiverId: [req.user?._id],
    notifyUser: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Bookmark deleted successfully',
    data: null,
  });
});

export const BookmarkController = {
  createBookmark,
  deleteBookmarks,
  getAllBookmarks,
  getDetails,
  getAllBookmarkedIds,
};
