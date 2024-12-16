import { generateFileData } from '../helpers/totalum';
import { generatePdfByTemplate, getExtendedOrderById } from '../services/totalum';

export async function generateMandate(orderId: string) {
  try {
    const order = await getExtendedOrderById(orderId);

    const fileData = generateFileData(order);
    const templateId = '675fd876302266a6d14228ee';
    const fileName = 'Autorizacion para realizar el tramite.pdf';

    const { url: fileUrl } = await generatePdfByTemplate({ templateId, fileName, data: fileData });

    return fileUrl;
  } catch (error) {
    throw error;
  }
}
