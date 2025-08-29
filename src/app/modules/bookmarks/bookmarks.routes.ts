import { Router } from 'express';
import auth from '../../middleware/auth';
import { Role } from '../auth/auth.interface';
import validateRequest from '../../middleware/validateRequest';
import { BookmarksValidationSchema } from './bookmarks.validation';
import { BookmarkController } from './bookmarks.controller';

const router = Router();

router.post(
  '/add-bookmark/:id',
  auth(Role.USER),
  validateRequest(BookmarksValidationSchema.BookmarksValidation),
  BookmarkController.createBookmark,
);

router.get(
  '/all-bookmarks',
  auth(Role.USER),
  BookmarkController.getAllBookmarks,
);

router.get(
  '/my-bookmarks/-ids',
  auth(Role.USER),
  BookmarkController.getAllBookmarkedIds,
);

router.get(
  '/bookmark-details/:id',
  auth(Role.USER),
  BookmarkController.getDetails,
);

router.delete(
  '/delete-bookmark/:id',
  auth(Role.USER),
  BookmarkController.deleteBookmarks,
);

export const BookmarkRoutes = router;
