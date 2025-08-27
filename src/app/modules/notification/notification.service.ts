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
import QueryBuilder from '../../builder/QueryBuilder';
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

const getAllNotifications = async (query: Record<string, unknown>) => {
  const { ...pQuery } = query;

  const baseQuery = Notification.find();

  const notificationsQuery = new QueryBuilder(baseQuery, pQuery)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await notificationsQuery.modelQuery;
  const meta = await notificationsQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

const deleteNotification = async (id: string) => {
  const result = await Notification.findByIdAndDelete({ _id: id });
  return result;
};

const deleteAllNotifications = async () => {
  const result = await Notification.deleteMany({});
  return result;
};

const getAllUserNotifications = async (
  user: IJwtPayload,
  query: Record<string, unknown>,
) => {
  const userId = user._id;
  const { ...pQuery } = query;

  let baseQuery;

  switch (user.role) {
    case Role.USER:
      baseQuery = Notification.find({
        notifyUser: true,
        receiverId: userId,
      });
      break;

    case Role.ADMIN:
      baseQuery = Notification.find({
        notifyAdmin: true,
      });
      break;

    case Role.SHELTER:
      baseQuery = Notification.find({
        notifyShelter: true,
        receiverId: userId,
      });
      break;

    default:
      baseQuery = Notification.find({
        receiverId: userId,
      });
      break;
  }

  const notificationsQuery = new QueryBuilder(baseQuery, pQuery)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await notificationsQuery.modelQuery;
  const meta = await notificationsQuery.countTotal();

  // Count read and unread notifications
  const readNotificationCount = result.filter((n) => n.isRead).length;
  const unreadNotificationCount = result.filter((n) => !n.isRead).length;

  return {
    meta,
    data: result,
    readNotificationCount,
    unreadNotificationCount,
  };
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
  getAllNotifications,
  deleteNotification,
  deleteAllNotifications,
  getAllUserNotifications,
  markNotificationsAsRead,
};
