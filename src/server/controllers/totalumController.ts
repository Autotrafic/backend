import { NextFunction, Request, Response } from 'express';
import sseClientManager from '../../sse/sseClientManager';
import { catchControllerError } from '../../errors/generalError';
import { SendOrderMandatesBody, ToggleTotalumHeaderBody, UpdateTaskBody } from '../../interfaces/import/totalum';
import { getAllCollaborators, getAllPendingTasks, getAllProfessionalParteners, updateTaskById } from '../services/totalum';
import { parseTaskFromTotalum } from '../parsers/task';
import { handleDocusealMandateEvent, sendMandates } from '../handlers/totalum';

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

export async function getAllTotalumProfessionalParteners(req: Request, res: Response, next: NextFunction) {
  try {
    const professionalPartners = await getAllProfessionalParteners();

    res.status(200).json({ professionalPartners });
  } catch (error) {
    catchControllerError(error, 'Error fetching totalum professional partners', req.body, next);
  }
}

export async function getAllTotalumCollaborators(req: Request, res: Response, next: NextFunction) {
  try {
    const collaborators = await getAllCollaborators();

    res.status(200).json({ collaborators });
  } catch (error) {
    catchControllerError(error, 'Error fetching totalum collaborators', req.body, next);
  }
}

export async function sendOrderMandates(req: SendOrderMandatesBody, res: Response, next: NextFunction) {
  try {
    const { orderId, mandateIsFor } = req.body;

    await sendMandates(orderId, mandateIsFor);

    res.status(200).json({ success: true });
  } catch (error) {
    catchControllerError(error, 'Error enviando los mandatos', req.body, next, error?.publicMessage);
  }
}

export async function handleDocusealWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const webhook = req.body;

    if (webhook?.data?.id && webhook.data?.submission_id) {
      await handleDocusealMandateEvent(webhook);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    catchControllerError(error, 'Error gestionando el webhook de docuseal', req.body, next);
  }
}
