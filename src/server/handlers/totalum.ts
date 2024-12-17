import { docusealSendSMSEventId } from '../../utils/totalum';
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
    const { fullName: userFullName, phoneNumber: userPhone } = fileData.client;

    const fileUrl = await generateMandateFile(fileData);
    const submission = await sendMandateDocuSeal({ fileUrl, fileData });

    const isMandateSended = submission.submission_events.filter((event) => event.id === docusealSendSMSEventId).length > 0;

    if (isMandateSended) {
      await updateTotalumForSendedMandates({ orderId, submissionId: submission.id });
      await notifyForMandate(fileData);
    }
  } catch (error) {
    throw new Error(`Error generando el mandato, ${error.message}`);
  }
}
