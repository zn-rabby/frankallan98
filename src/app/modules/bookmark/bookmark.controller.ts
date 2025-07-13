import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BookmarkService } from './bookmark.service';

const toggleBookmark = catchAsync(async (req: Request, res: Response) => {
     const { id }: any = req.user;
     const artist = req.params.id;
     const payload: any = { id, artist };
     const result = await BookmarkService.toggleBookmark(payload);

     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: result,
     });
});

const getBookmark = catchAsync(async (req: Request, res: Response) => {
     const user: any = req.user;
     const result = await BookmarkService.getBookmark(user);
     sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Bookmark Retrieved Successfully',
          data: result,
     });
});

export const BookmarkController = { toggleBookmark, getBookmark };
