import axios from 'axios';
import { DOCUSEAL_API, docusealOptions } from '../../utils/constants';

export async function createTemplateFromPdf({
  pdfBase64,
  userFullName,
  vehiclePlate,
}: CreateTemplateFromPdf): Promise<DocusealTemplate> {
  try {
    const options = {
      method: 'POST',
      url: `${DOCUSEAL_API}/templates/pdf`,
      headers: docusealOptions,
      data: {
        name: vehiclePlate,
        documents: [
          {
            name: 'string',
            file: pdfBase64,
            fields: [
              {
                name: userFullName,
                role: 'MANDANTE',
                type: 'signature',
                areas: [{ x: 241, y: 635, w: 120, h: 40, page: 1 }],
              },
            ],
          },
        ],
      },
    };

    const newTemplate = await axios.request(options);

    return newTemplate.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Error creando la plantilla de Docuseal desde el pdf: ${error.response.data.error}`);
    } else {
      throw new Error(`Error creando la plantilla de Docuseal desde el pdf: ${error.message}`);
    }
  }
}

export async function getSubmissionById(submissionId: number): Promise<DSubmissionDoneSubmitter> {
  try {
    const options = {
      method: 'GET',
      url: `${DOCUSEAL_API}/submissions/${submissionId}`,
      headers: docusealOptions,
    };

    const submission = await axios.request(options);

    return submission.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Error obteniendo submission de DocuSeal por id: ${error.response.data.error}`);
    } else {
      throw new Error(`Error obteniendo submission de DocuSeal por id: ${error.message}`);
    }
  }
}

export async function createSubmission({
  templateId,
  userFullName,
  userPhone,
  userRole = 'MANDANTE',
}: CreateSubmission): Promise<DSubmissionDone[]> {
  if (!templateId || !userFullName || !userPhone) throw new Error('Faltan datos');

  try {
    const options = {
      method: 'POST',
      url: `${DOCUSEAL_API}/submissions`,
      headers: docusealOptions,
      data: {
        template_id: templateId,
        send_email: false,
        send_sms: true,
        submitters: [{ role: userRole, name: userFullName, phone: userPhone, send_sms: true, send_email: false }],
      },
    };

    const newSubmission = await axios.request(options);

    return newSubmission.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Error haciendo el envío del documento Docuseal: ${error.response.data.error}`);
    } else {
      throw new Error(`Error haciendo el envío del documento Docuseal: ${error.message}`);
    }
  }
}
