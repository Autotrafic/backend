import { NextFunction, Response } from 'express';
import sseClientManager from '../../sse/sseClientManager';
import { catchControllerError } from '../../errors/generalError';
import { ToggleTotalumHeaderBody } from '../../interfaces/import/totalum';

export async function toggleTotalumActiveHeader(req: ToggleTotalumHeaderBody, res: Response, next: NextFunction) {
  try {
    const { activeHeader } = req.body;

    sseClientManager.broadcast('totalum_active_header', { activeHeader });
  } catch (error) {
    catchControllerError(error, 'Error toggling totalum header content', req.body, next);
  }
}
