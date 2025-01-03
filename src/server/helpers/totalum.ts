import { nanoid } from 'nanoid';
import { TMandateIsFor, TMandateState, TOrderMandate } from '../../interfaces/enums';
import { DMandateIsFor } from '../../interfaces/import/totalum';
import { TExtendedMandate, TMandate } from '../../interfaces/totalum/mandato';
import { MandateData, MandatePartner } from '../../interfaces/totalum/other';
import { TExtendedOrder } from '../../interfaces/totalum/pedido';
import { isClientAPartner, isOrderForCollaborator, ovidiuPartnerData } from '../../utils/totalum';
import { parsePdfUrlToBase64 } from '../parsers/file';
import { extractDriveFolderIdFromLink } from '../parsers/other';
import { parseTotalumOrderToMandateFileData } from '../parsers/totalum';
import { createSubmission, createTemplateFromPdf, getSubmissionById } from '../services/docuseal';
import { arePreviousWhatsappMessages, sendWhatsappMessage } from '../services/notifier';
import {
  createMandate,
  generatePdfByTotalumTemplate,
  getExtendedOrderById,
  updateMandateById,
  updateOrderById,
} from '../services/totalum';
import { uploadBase64FileToDrive } from '../services/googleDrive';
import {
  getMandatesSignedMessageForCollaborator,
  mandateSignedByBuyerMessage,
  mandateSignedBySellerMessage,
  mandatesSignedMessage,
} from '../../utils/messages';
import { TExtendedRelatedPerson } from '../../interfaces/totalum/cliente';

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
    throw {
      publicMessage: error?.publicMessage,
      message: `Error generando los datos para el archivo de mandato: ${error?.publicMessage ?? error.message}`,
    };
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
      if (!client.fullName) throw { status: 400, publicMessage: `El representante de ${subjectType} no contiene nombre` };

      if (!client.nif) throw { status: 400, publicMessage: `El representante de ${subjectType} no contiene NIF` };

      if (!client.address) throw { status: 400, publicMessage: `El representante de ${subjectType} no contiene dirección` };

      if (!client.phoneNumber) throw { status: 400, publicMessage: `${subjectType} no contiene teléfono` };

      if (!company.fullName)
        throw { status: 400, publicMessage: `La empresa asociada al ${subjectType} no contiene nombre` };

      if (!company.nif) throw { status: 400, publicMessage: `La empresa asociada al ${subjectType} no contiene NIF` };
    } else {
      if (!client.fullName) throw { status: 400, publicMessage: `${subjectType} no contiene nombre` };

      if (!client.nif) throw { status: 400, publicMessage: `${subjectType} no contiene NIF` };

      if (!client.address) throw { status: 400, publicMessage: `${subjectType} no contiene dirección` };
    }

    if (!orderType)
      throw { status: 400, publicMessage: `El pedido asociado al ${subjectType} no contiene 'Tipo de Pedido'` };

    if (!vehiclePlate) throw { status: 400, publicMessage: `El pedido asociado al ${subjectType} no contiene matrícula` };

    if (!actualDate.year)
      throw {
        status: 400,
        publicMessage: `La fecha actual del pedido asociado al ${subjectType} no contiene año (contactar con soporte)`,
      };

    if (!actualDate.month)
      throw {
        status: 400,
        ublicMessage: `La fecha actual del pedido asociado al ${subjectType} no contiene mes (contactar con soporte)`,
      };

    if (!actualDate.day)
      throw {
        status: 400,
        publicMessage: `La fecha actual del pedido asociado al ${subjectType} no contiene día (contactar con soporte)`,
      };
  });

  return true;
}

export function validateRelatedPersons(relatedPersons: TExtendedRelatedPerson[]) {
  if (!relatedPersons || relatedPersons.length < 1) {
    throw new Error(
      `El pedido no contiene ninguna persona relacionada. Para la acción que quieres hacer, se necesita que exista una.`
    );
  } else if (relatedPersons.length > 2) {
    throw new Error(
      `El pedido contiene más de 2 personas relacionadas. Para la acción que quieres hacer, sólo se permite que existan dos como máximo.`
    );
  }
}

export async function areOrderMandatesSigned(orderId: string): Promise<boolean> {
  try {
    const extendedOrder = await getExtendedOrderById(orderId);
    const orderMandates: TMandate[] = extendedOrder.mandato ?? [];

    const hasAtLeastOneSigned = (mandates: TMandate[], type: TMandateIsFor) =>
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

export async function processSignedMandate(mandates: TExtendedMandate[], newSubmissionId: number) {
  for (let mandate of mandates) {
    await updateMandateById(mandate._id, { estado: TMandateState.Signed });

    if (!mandate.pedido?._id)
      throw new Error(`Se ha actualizado el mandato sin estar relacionado a ningún pedido: ${JSON.stringify(mandate)}`);

    const order = await getExtendedOrderById(mandate.pedido._id);

    const submission = await getSubmissionById(newSubmissionId);
    const signedFiles = submission.documents;

    await processSignedFiles(signedFiles, order);

    const mandatesSigned = await areOrderMandatesSigned(order._id);
    await notifySignedMandate(mandatesSigned, mandate.mandato_es_para, order);

    if (mandatesSigned) {
      await updateOrderById(order._id, { mandatos: TOrderMandate.Adjuntados });
      await notifySignedMandates(order);
    }
  }
}

async function notifySignedMandate(areMandatesSigned: boolean, mandateIsFor: TMandateIsFor, order: TExtendedOrder) {
  try {
    if (!areMandatesSigned) {
      if (mandateIsFor === TMandateIsFor.Client) {
        const phone = order.cliente.telefono;
        phone && (await sendWhatsappMessage({ phoneNumber: phone, message: mandateSignedByBuyerMessage }));
      }

      if (mandateIsFor === TMandateIsFor.RelatedPerson) {
        for (let relatedPerson of order.persona_relacionada) {
          const phone = relatedPerson.cliente.telefono;
          phone && (await sendWhatsappMessage({ phoneNumber: phone, message: mandateSignedBySellerMessage }));
        }
      }
    }
  } catch (error) {
    throw new Error(`Error notifying signed mandate: ${error.message}`);
  }
}

async function notifySignedMandates(order: TExtendedOrder) {
  try {
    if (isOrderForCollaborator(order.comunidad_autonoma)) {
      await sendWhatsappMessage({
        phoneNumber: order.gestoria_colaboradora.whatsapp,
        message: getMandatesSignedMessageForCollaborator(order.matricula, order.documentos),
      });
    } else if (!isClientAPartner(order.cliente)) {
      await sendWhatsappMessage({ phoneNumber: order.cliente.telefono, message: mandatesSignedMessage });
    }
  } catch (error) {
    throw new Error(`Error notifying when all mandates signed: ${error.message}`);
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
