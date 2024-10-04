import fs, { createReadStream, unlink } from 'fs';
import { google, drive_v3 } from 'googleapis';
import '../../loadEnvironment';
import { getMonthNameInSpanish } from '../../utils/funcs';
import { createTextFile, formatDataForTextFile } from '../../utils/file';
import { DatabaseOrder } from '../../database/models/Order/WebOrder';
import { parseBase64ToPDFFile } from '../parsers/file';

const key = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

const jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, ['https://www.googleapis.com/auth/drive']);
const drive = google.drive({ version: 'v3', auth: jwtClient });

export async function uploadBase64FileToDrive(base64Data: string, folderId: string, fileName: string) {
  try {
    const file = await parseBase64ToPDFFile(base64Data, fileName);
    await uploadStreamFileToDrive(file, folderId);
  } catch (error) {
    throw new Error(`Failed to upload base64 file to Drive: ${error}`);
  }
}

export async function uploadStreamFileToDrive(file: Express.Multer.File, parentFolderId: string) {
  try {
    const fileMetadata: drive_v3.Params$Resource$Files$Create = {
      requestBody: {
        name: `${file.originalname}`,
        mimeType: file.mimetype,
        parents: [parentFolderId],
      },
      media: {
        mimeType: file.mimetype,
        body: createReadStream(file.path),
      },
      fields: 'id',
    };

    await drive.files.create(fileMetadata);

    unlink(file.path, (err) => {
      if (err) console.log(err);
      else {
        console.log(`\nDeleted uploaded file from: ${file.path}`);
      }
    });
  } catch (error) {
    throw new Error(`Failed to upload stream file to Drive: ${error}`);
  }
}

async function createFolder(folderName: string, parentFolderId?: string): Promise<string> {
  const fileMetadata: drive_v3.Params$Resource$Files$Create = {
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentFolderId ? [parentFolderId] : [],
    },
    fields: 'id',
  };

  try {
    const response = await drive.files.create(fileMetadata);
    return response.data.id!;
  } catch (error) {
    console.error('Failed to create folder:', error);
    throw error;
  }
}

export async function ensureFolderExists(folderName: string, folderToCheck: string): Promise<string | null> {
  try {
    const query = `'${folderToCheck}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!;
      // eslint-disable-next-line no-else-return
    } else {
      return await createFolder(folderName, folderToCheck);
    }
  } catch (error) {
    console.error('Failed to check or create folder:', error);
    throw error;
  }
}

export async function getOrderFolder(folderName: string, parentFolderId: string): Promise<string> {
  try {
    const actualMonthName = getMonthNameInSpanish().toUpperCase();
    const monthFolderId = await ensureFolderExists(actualMonthName, parentFolderId);

    return await ensureFolderExists(folderName, monthFolderId);
  } catch (error) {
    console.error('Failed to create folder inside the month name:', error);
    throw error;
  }
}

export async function checkFileExists(fileName: string, folderId: string): Promise<string | null> {
  try {
    const query = `'${folderId}' in parents and name = '${fileName}' and trashed = false`;
    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Failed to check file existence:', error);
    throw error;
  }
}

export async function uploadAdditionalInformationFile(orderData: DatabaseOrder, orderFolderId: string) {
  const isAlreadyUploaded = await checkFileExists('Información Adicional', orderFolderId);
  if (isAlreadyUploaded) return;

  const orderDataFile = await createTextFile(formatDataForTextFile(orderData));

  await uploadStreamFileToDrive(orderDataFile as Express.Multer.File, orderFolderId);
}
