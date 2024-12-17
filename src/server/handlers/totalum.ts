import { DocusealSubmissionStatus } from '../../interfaces/enums';
import { DMandateIsFor } from '../../interfaces/import/totalum';
import {
  generateFileData,
  generateMandateFile,
  notifyForMandate,
  sendMandateDocuSeal,
  updateTotalumForSendedMandates,
} from '../helpers/totalum';
import { getExtendedOrderById } from '../services/totalum';

export async function sendMandates(orderId: string, mandateIsFor: DMandateIsFor) {
  try {
    const order = await getExtendedOrderById(orderId);
    const filesData = generateFileData(order, mandateIsFor);

    for (let fileData of filesData) {
      const fileUrl = await generateMandateFile(fileData);
      const submission = await sendMandateDocuSeal({ fileUrl, fileData });

      const isMandateSended = submission?.[0]?.status === DocusealSubmissionStatus.Awaiting;

      if (isMandateSended) {
        await updateTotalumForSendedMandates({ orderId, submissionId: submission[0].id, fileData });
        await notifyForMandate(fileData);
      }
    }
  } catch (error) {
    throw new Error(`Error generando el mandato: ${error.message}`);
  }
}
