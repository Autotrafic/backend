import { DocusealFormWebhookEventType, DocusealSubmissionStatus } from '../../interfaces/enums';
import { DMandateIsFor } from '../../interfaces/import/totalum';
import {
  generateFileData,
  generateMandateFile,
  notifyForMandate,
  processDeclinedMandate,
  processSignedMandate,
  processViewedMandate,
  sendMandateDocuSeal,
  updateTotalumOnceMandatesSended,
} from '../helpers/totalum';
import { getExtendedOrderById, getMandatesByFilter } from '../services/totalum';

export async function sendMandates(orderId: string, mandateIsFor: DMandateIsFor) {
  try {
    const order = await getExtendedOrderById(orderId);
    const filesData = generateFileData(order, mandateIsFor);

    for (let fileData of filesData) {
      const fileUrl = await generateMandateFile(fileData);
      const submission = await sendMandateDocuSeal({ fileUrl, fileData });

      const isMandateSended = submission?.[0]?.status === DocusealSubmissionStatus.Awaiting;

      if (isMandateSended) {
        await updateTotalumOnceMandatesSended({ orderId, submissionId: submission[0].id, fileData });
        await notifyForMandate(fileData);
      }
    }
  } catch (error) {
    if (error.publicMessage) throw error;
    throw new Error(`Error generando el mandato: ${error.message}`);
  }
}

export async function handleDocusealMandateEvent(webhook: any) {
  const submissionId = webhook.data.id;
  const newSubmissionId = webhook.data.submission_id;

  const mandates = await getMandatesByFilter('docuseal_submission_id', submissionId);

  if (mandates.length > 0) {
    if (webhook.event_type === DocusealFormWebhookEventType.Viewed) {
      await processViewedMandate(mandates);
    } else if (webhook.event_type === DocusealFormWebhookEventType.Completed) {
      await processSignedMandate(mandates, newSubmissionId);
    } else if (webhook.event_type === DocusealFormWebhookEventType.Declined) {
      await processDeclinedMandate(mandates);
    }
  } else {
    throw new Error(
      `Se ha recibido un evento de Docuseal de tipo: ${webhook.event_type}, pero no se ha encontrado ningun pedido con el docuseal submission id: ${submissionId}. No se ha actualizado ningun pedido.`
    );
  }
}
