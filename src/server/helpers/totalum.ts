import { TOrderMandate } from '../../interfaces/enums';
import { DMandateIsFor } from '../../interfaces/import/totalum';
import { TExtendedOrder } from '../../interfaces/totalum/pedido';
import { parsePdfUrlToBase64 } from '../parsers/file';
import { parseTotalumOrderToMandateFileData } from '../parsers/totalum';
import { createSubmission, createTemplateFromPdf } from '../services/docuseal';
import { arePreviousWhatsappMessages, sendWhatsappMessage } from '../services/notifier';
import { createMandate, generatePdfByTotalumTemplate, getMandatesByFilter, updateOrderById } from '../services/totalum';

export async function notifyForMandate(fileData: MandateData) {
  try {
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
  } catch (error) {
    throw new Error(`Error notificando el mandato: ${error.message}`);
  }
}

export async function updateTotalumForSendedMandates({
  orderId,
  submissionId,
  fileData,
}: {
  orderId: string;
  submissionId: number;
  fileData: MandateData;
}) {
  try {
    const mandateOptions: Partial<TMandate> = {
      totalum_order_id: orderId,
      docuseal_submission_id: submissionId,
      mandate_is_for: fileData.client.type,
    };

    await createMandate(mandateOptions);
    await updateOrderById(orderId, { mandatos: TOrderMandate.Enviados });
  } catch (error) {
    throw new Error(`Error actualizando totalum una vez enviados los mandatos: ${error.message}`);
  }
}

export async function sendMandateDocuSeal({ fileUrl, fileData }: SendMandateDocuSeal): Promise<DSubmissionDone[]> {
  try {
    const { client, vehiclePlate } = fileData;

    const pdfBase64 = await parsePdfUrlToBase64(fileUrl);

    const template = await createTemplateFromPdf({ pdfBase64, userFullName: client.fullName, vehiclePlate });
    const templateId = template.id;

    const submission = await createSubmission({ templateId, userFullName: client.fullName, userPhone: client.phoneNumber });

    return submission;
  } catch (error) {
    throw new Error(`Error enviando los mandatos mediante docuseal: ${error.message}`);
  }
}

export async function generateMandateFile(fileData: MandateData): Promise<string> {
  try {
    const totalumTemplateId = '675fd876302266a6d14228ee';
    const fileName = 'Autorizacion para realizar el tramite.pdf';

    const { url: fileUrl } = await generatePdfByTotalumTemplate({ templateId: totalumTemplateId, fileName, data: fileData });

    return fileUrl;
  } catch (error) {
    throw new Error(`Error generando el archivo de mandato: ${error.message}`);
  }
}

export function generateFileData(order: TExtendedOrder, mandateIsFor: DMandateIsFor): MandateData[] {
  try {
    const mandatesFilesData = parseTotalumOrderToMandateFileData(order, mandateIsFor);

    validateMandateFileData(mandatesFilesData);

    return mandatesFilesData;
  } catch (error) {
    throw new Error(`Error generando los datos para el archivo de mandato: ${error.message}`);
  }
}

export function validateMandateFileData(fileDataArray: MandateData[]): boolean {
  if (!Array.isArray(fileDataArray) || fileDataArray.length === 0) {
    throw new Error('No se recibieron datos de mandato para validar.');
  }

  fileDataArray.forEach((fileData) => {
    const { client, company, orderType, vehiclePlate, actualDate } = fileData;

    let subjectType;
    if (client.type === 'client') subjectType = 'cliente';
    if (client.type === 'related_person') subjectType = 'persona relacionada';

    if (client.nif && company.nif) {
      if (!client.fullName) throw new Error(`El representante de ${subjectType} no contiene nombre`);

      if (!client.nif) throw new Error(`El representante de ${subjectType} no contiene NIF`);

      if (!client.address) throw new Error(`El representante de ${subjectType} no contiene dirección`);

      if (!client.phoneNumber) throw new Error(`El ${subjectType} no contiene teléfono`);

      if (!company.fullName) throw new Error(`La empresa asociada al ${subjectType} no contiene nombre`);

      if (!company.nif) throw new Error(`La empresa asociada al ${subjectType} no contiene NIF`);
    } else {
      if (!client.fullName) throw new Error(`El ${subjectType} no contiene nombre`);

      if (!client.nif) throw new Error(`El ${subjectType} no contiene NIF`);

      if (!client.address) throw new Error(`El ${subjectType} no contiene dirección`);
    }

    if (!orderType) throw new Error(`El pedido asociado al ${subjectType} no contiene 'Tipo de Pedido'`);

    if (!vehiclePlate) throw new Error(`El pedido asociado al ${subjectType} no contiene matrícula`);

    if (!actualDate.year)
      throw new Error(`La fecha actual del pedido asociado al ${subjectType} no contiene año (contactar con soporte)`);

    if (!actualDate.month)
      throw new Error(`La fecha actual del pedido asociado al ${subjectType} no contiene mes (contactar con soporte)`);

    if (!actualDate.day)
      throw new Error(`La fecha actual del pedido asociado al ${subjectType} no contiene día (contactar con soporte)`);
  });

  return true;
}

export function validateRelatedPerson(relatedPersons: TExtendedRelatedPerson[]): TExtendedRelatedPerson {
  if (!relatedPersons || relatedPersons.length < 1) {
    throw new Error(
      `El pedido no contiene ninguna persona relacionada. Para la acción que quieres hacer, se necesita que exista una.`
    );
  } else if (relatedPersons.length > 1) {
    throw new Error(
      `El pedido contiene múltiples personas relacionadas. Para la acción que quieres hacer, sólo se permite que exista una.`
    );
  } else {
    return relatedPersons[0];
  }
}

export async function areOrderMandatesSigned(orderId: string): Promise<boolean> {
  try {
    const orderMandates = await getMandatesByFilter('totalum_order_id', orderId);

    const hasAtLeastOneSigned = (mandates: TMandate[], type: TMandateIsFor) =>
      mandates.some((mandate) => mandate.mandate_is_for === type && mandate.signed === 'true');

    const clientSigned = hasAtLeastOneSigned(orderMandates, 'client');
    const relatedPersonSigned = hasAtLeastOneSigned(orderMandates, 'related_person');

    const hasClientMandates = orderMandates.some((m) => m.mandate_is_for === 'client');
    const hasRelatedPersonMandates = orderMandates.some((m) => m.mandate_is_for === 'related_person');

    const clientsValid = !hasClientMandates || clientSigned;
    const relatedPersonsValid = !hasRelatedPersonMandates || relatedPersonSigned;

    return clientsValid && relatedPersonsValid;
  } catch (error) {
    throw new Error(`Error comprobando si los mandatos del pedido se han firmado: ${error.message}`);
  }
}

interface SendMandateDocuSeal {
  fileUrl: string;
  fileData: MandateData;
}
