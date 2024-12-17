import { TOrderMandate } from '../../interfaces/enums';
import { TExtendedOrder } from '../../interfaces/totalum/pedido';
import { docusealSendSMSEventId } from '../../utils/totalum';
import { parsePdfUrlToBase64 } from '../parsers/file';
import { parseTotalumOrderToMandateFileData } from '../parsers/totalum';
import { createSubmission, createTemplateFromPdf } from '../services/docuseal';
import { arePreviousWhatsappMessages, sendWhatsappMessage } from '../services/notifier';
import { generatePdfByTotalumTemplate, updateOrderById } from '../services/totalum';

export async function notifyForMandate(fileData: MandateData) {
  const { client, vehiclePlate } = fileData;
  const arePreviousMessages = await arePreviousWhatsappMessages(client.phoneNumber);

  function getClientNotifyMessage() {
    return `Acabamos de enviar los mandatos para firmar por SMS a nombre de *DocuSeal*`;
  }

  function getRelatedPersonNotifyMessage(customerName: string, vehiclePlate: string) {
    return `*Muy buenas${customerName ? `, ${customerName}` : ''} 👋🏼*

Le saludamos desde *Gestoría AutoTrafic*.

Tenemos una transferencia de vehículo ${
      vehiclePlate ? `con matrícula ${vehiclePlate}` : ''
    } pendiente y necesitamos su autorización para continuar con el trámite.

Le hemos enviado un mandato para firmar por SMS a nombre de *DocuSeal*. Una vez recibida su firma, procederemos con el trámite y enviaremos el nuevo permiso de circulación al comprador ✅.

Gracias por su tiempo!`;
  }

  let notifyMessage: string = '';
  if (arePreviousMessages) {
    notifyMessage = getClientNotifyMessage();
  } else {
    notifyMessage = getRelatedPersonNotifyMessage(client.fullName, vehiclePlate);
  }

  const sendMessageOptions = { phoneNumber: client.phoneNumber, message: notifyMessage };
  await sendWhatsappMessage(sendMessageOptions);
}

export async function updateTotalumForSendedMandates({ orderId, submissionId }: { orderId: string; submissionId: number }) {
  await updateOrderById(orderId, { mandatos: TOrderMandate.Firmados, docuseal_submission_id: submissionId });
}

export async function sendMandateDocuSeal({ fileUrl, fileData }: SendMandateDocuSeal): Promise<DSubmissionDone> {
  const { client, vehiclePlate } = fileData;

  const pdfBase64 = await parsePdfUrlToBase64(fileUrl);

  const template = await createTemplateFromPdf({ pdfBase64, userFullName: client.fullName, vehiclePlate });
  const templateId = template.id;

  const submission = await createSubmission({ templateId, userFullName: client.fullName, userPhone: client.phoneNumber });

  return submission;
}

export async function generateMandateFile(fileData: MandateData): Promise<string> {
  const totalumTemplateId = '675fd876302266a6d14228ee';
  const fileName = 'Autorizacion para realizar el tramite.pdf';

  const { url: fileUrl } = await generatePdfByTotalumTemplate({ templateId: totalumTemplateId, fileName, data: fileData });

  return fileUrl;
}

export function generateFileData(order: TExtendedOrder): MandateData {
  const mandateFileData = parseTotalumOrderToMandateFileData(order);

  validateMandateFileData(mandateFileData);

  return mandateFileData;
}

function validateMandateFileData(fileData: MandateData): boolean {
  const { client, company, orderType, vehiclePlate, actualDate } = fileData;
  let isValid = true;

  if (client.nif && company.nif) {
    if (!client.fullName) throw new Error('El representante no contiene nombre');

    if (!client.nif) throw new Error('El representante no contiene NIF');

    if (!client.address) throw new Error('El representante no contiene dirección');

    if (!client.phoneNumber) throw new Error('El cliente no contiene teléfono');

    if (!company.fullName) throw new Error('La empresa no contiene nombre');

    if (!company.nif) throw new Error('La empresa no contiene NIF');
  } else {
    if (!client.fullName) throw new Error('El cliente no contiene nombre');

    if (!client.nif) throw new Error('El cliente no contiene NIF');

    if (!client.address) throw new Error('El cliente no contiene dirección');
  }

  if (!orderType) throw new Error("El pedido no contiene 'Tipo de Pedido'");

  if (!vehiclePlate) throw new Error('El pedido no contiene matrícula');

  if (!actualDate.year) throw new Error('La fecha actual no contiene año (contactar con soporte)');

  if (!actualDate.month) throw new Error('La fecha actual no contiene mes (contactar con soporte)');

  if (!actualDate.day) throw new Error('La fecha actual no contiene día (contactar con soporte)');

  return isValid;
}

interface SendMandateDocuSeal {
  fileUrl: string;
  fileData: MandateData;
}
