import { NextFunction, Request, Response } from 'express';
import sseClientManager from '../../sse/sseClientManager';
import { catchControllerError } from '../../errors/generalError';
import { SendOrderMandatesBody, ToggleTotalumHeaderBody, UpdateTaskBody } from '../../interfaces/import/totalum';
import {
  getAllCollaborators,
  getAllPendingTasks,
  getAllProfessionalParteners,
  getMandatesByFilter,
  getOrderById,
  updateMandateById,
  updateOrderById,
  updateTaskById,
} from '../services/totalum';
import { parseTaskFromTotalum } from '../parsers/task';
import { sendMandates } from '../handlers/totalum';
import { DocusealFormWebhookEventType, TOrderMandate } from '../../interfaces/enums';
import { getSubmissionById } from '../services/docuseal';
import { parsePdfUrlToBase64 } from '../parsers/file';
import { uploadBase64FileToDrive } from '../services/googleDrive';
import { extractDriveFolderIdFromLink } from '../parsers/other';
import { nanoid } from 'nanoid';
import { areOrderMandatesSigned } from '../helpers/totalum';

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
    catchControllerError(error, 'Error enviando los mandatos', req.body, next);
  }
}

export async function handleDocusealWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const webhook = req.body;

    if (webhook.event_type === DocusealFormWebhookEventType.Completed && webhook?.data?.id) {
      const submissionId = webhook.data.id;
      const mandates = await getMandatesByFilter('docuseal_submission_id', submissionId);

      if (mandates.length > 0) {
        console.log('mandate', mandates);
        for (let mandate of mandates) {
          await updateMandateById(mandate._id, { signed: 'true' });

          const order = await getOrderById(mandate.totalum_order_id);

          const submission = await getSubmissionById(submissionId);
          const signedFiles = submission.documents;

          for (let file of signedFiles) {
            const base64File = await parsePdfUrlToBase64(file.url);
            const driveFolderId = extractDriveFolderIdFromLink(order.documentos);
            const fileName = `Mandato firmado ${nanoid(4)}`;

            await uploadBase64FileToDrive(base64File, driveFolderId, fileName);

            const mandatesSigned = await areOrderMandatesSigned(order._id);
            if (mandatesSigned) await updateOrderById(order._id, { mandatos: TOrderMandate.Firmados });
          }
        }

        res.status(200).json({ message: 'DocuSeal webhook processed successfully!' });
      } else {
        throw new Error(
          `Se ha recibido un webhook de Docuseal de ${DocusealFormWebhookEventType.Completed}, pero no se ha encontrado ningun pedido con el docuseal submission id: ${submissionId}. No se ha actualizado ningun pedido.`
        );
      }
    }
  } catch (error) {
    catchControllerError(error, 'Error gestionando el webhook de docuseal', req.body, next);
  }
}
