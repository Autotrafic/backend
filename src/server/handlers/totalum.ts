import { DocusealSubmissionStatus } from '../../interfaces/enums';
import {
  generateFileData,
  generateMandateFile,
  notifyForMandate,
  sendMandateDocuSeal,
  updateTotalumForSendedMandates,
} from '../helpers/totalum';
import { getExtendedOrderById } from '../services/totalum';

export async function sendMandate(orderId: string) {
  try {
    const order = await getExtendedOrderById(orderId);
    const fileData = generateFileData(order);

    const fileUrl = await generateMandateFile(fileData);
    const submission = await sendMandateDocuSeal({ fileUrl, fileData });

    const isMandateSended = submission?.[0]?.status === DocusealSubmissionStatus.Awaiting;

    if (isMandateSended) {
      await updateTotalumForSendedMandates({ orderId, submissionId: submission[0].id });
      await notifyForMandate(fileData);
    }
  } catch (error) {
    throw new Error(`Error generando el mandato: ${error.message}`);
  }
}
