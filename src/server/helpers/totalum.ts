import { nanoid } from 'nanoid';
import { TMandateIsFor, TMandateState, TOrderMandate } from '../../interfaces/enums';
import { DMandateIsFor } from '../../interfaces/import/totalum';
import { TExtendedMandate, TMandate } from '../../interfaces/totalum/mandato';
import { MandateData, MandatePartner } from '../../interfaces/totalum/other';
import { TExtendedOrder } from '../../interfaces/totalum/pedido';
import { ovidiuPartnerData } from '../../utils/totalum';
import { parsePdfUrlToBase64 } from '../parsers/file';
import { extractDriveFolderIdFromLink } from '../parsers/other';
import { parseTotalumOrderToMandateFileData } from '../parsers/totalum';
import { createSubmission, createTemplateFromPdf, getSubmissionById } from '../services/docuseal';
import { arePreviousWhatsappMessages, sendWhatsappMessage } from '../services/notifier';
import {
  createMandate,
  generatePdfByTotalumTemplate,
  getMandatesByFilter,
  getOrderById,
  updateMandateById,
  updateOrderById,
} from '../services/totalum';
import { uploadBase64FileToDrive } from '../services/googleDrive';

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
        vehiclePlate ? `con matrícula *${vehiclePlate}*` : ''
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

export async function updateTotalumOnceMandatesSended({ orderId, submissionId, fileData }: UpdateTotalumOnceMandatesSended) {
  try {
    const mandateOptions: Partial<TMandate> = {
      pedido: orderId,
      docuseal_submission_id: submissionId,
      mandato_es_para: fileData.client.type,
      estado: TMandateState.Sended,
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
    if (error.publicMessage) throw error;
    throw new Error(`Error generando los datos para el archivo de mandato: ${error.message}`);
  }
}

function validateMandateFileData(fileDataArray: MandateData[]): boolean {
  if (!Array.isArray(fileDataArray) || fileDataArray.length === 0) {
    throw new Error('No se recibieron datos de mandato para validar.');
  }

  fileDataArray.forEach((fileData) => {
    const { client, company, orderType, vehiclePlate, actualDate } = fileData;

    let subjectType;
    if (client.type === TMandateIsFor.Client) subjectType = 'Cliente';
    if (client.type === TMandateIsFor.RelatedPerson) subjectType = 'Persona Relacionada';

    if (client.nif && company.nif) {
      if (!client.fullName) throw { publicMessage: `El representante de ${subjectType} no contiene nombre` };

      if (!client.nif) throw { publicMessage: `El representante de ${subjectType} no contiene NIF` };

      if (!client.address) throw { publicMessage: `El representante de ${subjectType} no contiene dirección` };

      if (!client.phoneNumber) throw { publicMessage: `${subjectType} no contiene teléfono` };

      if (!company.fullName) throw { publicMessage: `La empresa asociada al ${subjectType} no contiene nombre` };

      if (!company.nif) throw { publicMessage: `La empresa asociada al ${subjectType} no contiene NIF` };
    } else {
      if (!client.fullName) throw { publicMessage: `${subjectType} no contiene nombre` };

      if (!client.nif) throw { publicMessage: `${subjectType} no contiene NIF` };

      if (!client.address) throw { publicMessage: `${subjectType} no contiene dirección` };
    }

    if (!orderType) throw { publicMessage: `El pedido asociado al ${subjectType} no contiene 'Tipo de Pedido'` };

    if (!vehiclePlate) throw { publicMessage: `El pedido asociado al ${subjectType} no contiene matrícula` };

    if (!actualDate.year)
      throw {
        publicMessage: `La fecha actual del pedido asociado al ${subjectType} no contiene año (contactar con soporte)`,
      };

    if (!actualDate.month)
      throw {
        publicMessage: `La fecha actual del pedido asociado al ${subjectType} no contiene mes (contactar con soporte)`,
      };

    if (!actualDate.day)
      throw {
        publicMessage: `La fecha actual del pedido asociado al ${subjectType} no contiene día (contactar con soporte)`,
      };
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

    const hasAtLeastOneSigned = (mandates: TExtendedMandate[], type: TMandateIsFor) =>
      mandates.some((mandate) => mandate.mandato_es_para === type && mandate.estado === TMandateState.Signed);

    const clientSigned = hasAtLeastOneSigned(orderMandates, TMandateIsFor.Client);
    const relatedPersonSigned = hasAtLeastOneSigned(orderMandates, TMandateIsFor.RelatedPerson);

    const hasClientMandates = orderMandates.some((m) => m.mandato_es_para === TMandateIsFor.Client);
    const hasRelatedPersonMandates = orderMandates.some((m) => m.mandato_es_para === TMandateIsFor.RelatedPerson);

    const clientsValid = !hasClientMandates || clientSigned;
    const relatedPersonsValid = !hasRelatedPersonMandates || relatedPersonSigned;

    return clientsValid && relatedPersonsValid;
  } catch (error) {
    throw new Error(`Error comprobando si los mandatos del pedido se han firmado: ${error.message}`);
  }
}

export function ensureMandatePartner(partner: MandatePartner): MandatePartner {
  if (!partner) return ovidiuPartnerData;

  const { nombre_gestor, nif_gestor, num_colegiado_gestor, nombre_colegio_gestor, domicilio_despacho_profesional } = partner;

  if (!nombre_gestor || !nif_gestor || !num_colegiado_gestor || !nombre_colegio_gestor || !domicilio_despacho_profesional) {
    return ovidiuPartnerData;
  } else {
    return partner;
  }
}

export async function processViewedMandate(mandates: any[]) {
  for (let mandate of mandates) {
    await updateMandateById(mandate._id, { estado: TMandateState.Opened });

    if (!mandate.pedido?._id)
      throw new Error(`Se ha actualizado el mandato sin estar relacionado a ningún pedido: ${JSON.stringify(mandate)}`);
  }
}

export async function processDeclinedMandate(mandates: any[]) {
  for (let mandate of mandates) {
    await updateMandateById(mandate._id, { estado: TMandateState.Declined });

    if (!mandate.pedido?._id)
      throw new Error(`Se ha actualizado el mandato sin estar relacionado a ningún pedido: ${JSON.stringify(mandate)}`);
  }
}

export async function processSignedMandate(mandates: any[], newSubmissionId: number) {
  for (let mandate of mandates) {
    await updateMandateById(mandate._id, { estado: TMandateState.Signed });

    if (!mandate.pedido?._id)
      throw new Error(`Se ha actualizado el mandato sin estar relacionado a ningún pedido: ${JSON.stringify(mandate)}`);

    const order = await getOrderById(mandate.pedido._id);

    const submission = await getSubmissionById(newSubmissionId);
    const signedFiles = submission.documents;

    await processSignedFiles(signedFiles, order);

    const mandatesSigned = await areOrderMandatesSigned(order._id);

    if (mandatesSigned) {
      await updateOrderById(order._id, { mandatos: TOrderMandate.Adjuntados });
    }
  }
}

async function processSignedFiles(signedFiles: any[], order: any) {
  for (let file of signedFiles) {
    const base64File = await parsePdfUrlToBase64(file.url);
    const driveFolderId = extractDriveFolderIdFromLink(order.documentos);
    const fileName = `Mandato firmado ${nanoid(4)}`;

    await uploadBase64FileToDrive(base64File, driveFolderId, fileName);
  }
}

interface SendMandateDocuSeal {
  fileUrl: string;
  fileData: MandateData;
}

interface UpdateTotalumOnceMandatesSended {
  orderId: string;
  submissionId: number;
  fileData: MandateData;
}
