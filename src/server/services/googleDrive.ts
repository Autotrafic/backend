// src/services/googleDrive.ts
import { google, drive_v3 } from "googleapis";
import "../../loadEnvironment";

interface FileStream {
    stream: NodeJS.ReadableStream;
    filename: string;
    mimetype: string;
}

const key = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL!,
    private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
};

const jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, [
    "https://www.googleapis.com/auth/drive.file",
]);
const drive = google.drive({ version: "v3", auth: jwtClient });

export async function uploadStreamFileToDrive(
    file: FileStream,
    parentFolderId: string
): Promise<string> {
    const fileMetadata = {
        name: file.filename,
        mimeType: file.mimetype,
        parents: [parentFolderId],
    };

    const media = {
        mimeType: file.mimetype,
        body: file.stream,
    };

    try {
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: "id",
        });
        return response.data.id!;
    } catch (error) {
        console.error("Failed to upload file:", error);
        throw error;
    }
}

export async function createFolder(
    folderName: string,
    parentFolderId?: string
): Promise<string> {
    const fileMetadata: drive_v3.Params$Resource$Files$Create = {
        requestBody: {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
            parents: parentFolderId ? [parentFolderId] : [],
        },
        fields: "id",
    };

    try {
        const response = await drive.files.create(fileMetadata);
        return response.data.id!;
    } catch (error) {
        console.error("Failed to create folder:", error);
        throw error;
    }
}
