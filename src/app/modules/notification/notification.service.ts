import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';
import {
  emitMessage,
  emitMessageToAdmin,
  emitMessageToShelter,
  emitMessageToUser,
} from '../../utils/emitMessage';
import { IJwtPayload, Role } from '../auth/auth.interface';

const sendNotification = async (payload: INotification) => {
  const { data, receiverId, key, notifyAdmin, notifyUser, notifyShelter } =
    payload;
  const newNotification = await Notification.create(payload);

  if (!newNotification) {
    throw new AppError(
      StatusCodes.NOT_IMPLEMENTED,
      'Notification is not stored on database',
    );
  }

  receiverId.forEach((id) => {
    emitMessage(id.toString(), key, data);
  });

  if (notifyAdmin) {
    emitMessageToAdmin(key, data);
  }
  if (notifyUser) {
    emitMessageToUser(key, data);
  }
  if (notifyShelter) {
    emitMessageToShelter(key, data);
  }

  return { notification: newNotification };
};

const deleteNotification = async (id: string) => {
  const result = await Notification.findByIdAndDelete({ _id: id });
  return result;
};

const deleteAllNotifications = async (user: IJwtPayload) => {
  const role = user.role;
  let result;

  switch (role) {
    case Role.USER:
      result = await Notification.deleteMany({ notifyUser: true });
      break;
    case Role.ADMIN:
      result = await Notification.deleteMany({ notifyAdmin: true });
      break;
    case Role.SHELTER:
      result = await Notification.deleteMany({ notifyShelter: true });
      break;
    default:
      result = await Notification.deleteMany({ receiverId: user._id });
      break;
  }

  return result;
};

// const getAllUserNotifications = async (
//   user: IJwtPayload,
//   query: Record<string, unknown>,
// ) => {
//   const userId = user._id;
//   const { ...pQuery } = query;

//   let baseQuery;

//   switch (user.role) {
//     case Role.USER:
//       baseQuery = Notification.find({
//         notifyUser: true,
//         receiverId: userId,
//       });
//       break;

//     case Role.ADMIN:
//       baseQuery = Notification.find({
//         notifyAdmin: false,
//       });
//       break;

//     case Role.SHELTER:
//       baseQuery = Notification.find({
//         notifyShelter: true,
//         receiverId: userId,
//       });
//       break;

//     default:
//       baseQuery = Notification.find({
//         receiverId: userId,
//       });
//       break;
//   }

//   const notificationsQuery = new QueryBuilder(baseQuery, pQuery)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await notificationsQuery.modelQuery;
//   const meta = await notificationsQuery.countTotal();

//   // Count read and unread notifications
//   const readNotificationCount = result.filter((n) => n.isRead).length;
//   const unreadNotificationCount = result.filter((n) => !n.isRead).length;

//   return {
//     meta,
//     data: result,
//     readNotificationCount,
//     unreadNotificationCount,
//   };
// };

const getAllUserNotifications = async (
  user: IJwtPayload,
  query: Record<string, unknown>,
) => {
  const userId = user._id;
  const { ...pQuery } = query;

  const baseFilter: Record<string, unknown> = {};

  switch (user.role) {
    case Role.USER:
      baseFilter.notifyUser = true;
      baseFilter.receiverId = userId;
      break;

    case Role.ADMIN:
      baseFilter.notifyAdmin = true;
      break;

    case Role.SHELTER:
      baseFilter.notifyShelter = true;
      baseFilter.receiverId = userId;
      break;

    default:
      baseFilter.receiverId = userId;
      break;
  }

  // Apply query operators (pagination, sort, filter)
  let mongoQuery = Notification.find(baseFilter).sort({ createdAt: -1 });

  if (pQuery.sortBy && pQuery.sortOrder) {
    mongoQuery = mongoQuery.sort({
      [pQuery.sortBy as string]: pQuery.sortOrder === 'desc' ? -1 : 1,
    });
  }

  if (pQuery.limit) {
    mongoQuery = mongoQuery.limit(Number(pQuery.limit));
  }

  if (pQuery.skip) {
    mongoQuery = mongoQuery.skip(Number(pQuery.skip));
  }

  const notifications = await mongoQuery.exec();

  // Count read and unread notifications
  const readNotificationCount = notifications.filter((n) => n.isRead).length;
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, readNotificationCount, unreadNotificationCount };
};

export const markNotificationsAsRead = async (user: IJwtPayload) => {
  const userId = user._id;

  const result = await Notification.updateMany(
    {
      receiverId: userId,
      isRead: false,
    },
    {
      $set: { isRead: true },
    },
  );

  return {
    message: `${result.modifiedCount} notifications marked as read.`,
    modifiedCount: result.modifiedCount,
  };
};

export const NotificationService = {
  sendNotification,
  deleteNotification,
  deleteAllNotifications,
  getAllUserNotifications,
  markNotificationsAsRead,
};
