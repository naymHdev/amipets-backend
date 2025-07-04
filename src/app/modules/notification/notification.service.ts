import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';
import { emitMessage, emitMessageToAdmin } from '../../utils/emitMessage';

const sendNotification = async (payload: INotification) => {
  const { data, receiverId, key, notifyAdmin } = payload;
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
  return { notification: newNotification };
};

const getAllNotifications = async () => {
  const notifications = await Notification.find().populate('ownerId');
  return notifications;
};

export const NotificationService = {
  sendNotification,
  getAllNotifications,
};
