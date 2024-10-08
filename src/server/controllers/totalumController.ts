import { NextFunction, Request, Response } from 'express';
import sseClientManager from '../../sse/sseClientManager';
import { catchControllerError } from '../../errors/generalError';
import { ToggleTotalumHeaderBody } from '../../interfaces/import/totalum';
import { getAllPendingTasks } from '../services/totalum';
import { parseTaskFromTotalum } from '../parsers/task';

export async function toggleTotalumActiveHeader(req: ToggleTotalumHeaderBody, res: Response, next: NextFunction) {
  try {
    const { activeHeader } = req.body;

    sseClientManager.broadcast('totalum_active_header', { activeHeader });

    res.status(200).json({ success: true });
  } catch (error) {
    catchControllerError(error, 'Error toggling totalum header content', req.body, next);
  }
}

export async function getPendingTotalumTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const pendingTasks = await getAllPendingTasks();

    const parsedTasks = pendingTasks.map((task) => parseTaskFromTotalum(task));

    res.status(200).json(parsedTasks);
  } catch (error) {
    catchControllerError(error, 'Error fetching totalum tasks', req.body, next);
  }
}
