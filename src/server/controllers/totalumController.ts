import { NextFunction, Request, Response } from 'express';
import sseClientManager from '../../sse/sseClientManager';
import { catchControllerError } from '../../errors/generalError';
import { askShipmentAddressToClientBody, ToggleTotalumHeaderBody, UpdateTaskBody } from '../../interfaces/import/totalum';
import { getAllPendingTasks, updateTaskById } from '../services/totalum';
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

export async function updateTotalumTask(req: UpdateTaskBody, res: Response, next: NextFunction) {
  try {
    const { id, update } = req.body;

    const updatedTask = await updateTaskById(id, update);

    res.status(200).json(updatedTask);
  } catch (error) {
    catchControllerError(error, 'Error updating totalum task', req.body, next);
  }
}

export async function askShipmentAddressToClient(req: askShipmentAddressToClientBody, res: Response, next: NextFunction) {
  try {
    
  } catch (error) {
    catchControllerError(error, `No se ha podido avisar al cliente`, req.body, next);
  }
}
