import "../../loadEnvironment";
import { google, drive_v3 } from "googleapis";
import { Readable } from "stream";

const key = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

const jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, [
    "https://www.googleapis.com/auth/drive",
]);
const drive = google.drive({ version: "v3", auth: jwtClient });

export async function uploadFile(file: Express.Multer.File, parentFolderId: string): Promise<string> {
    const fileMetadata: drive_v3.Params$Resource$Files$Create = {
        requestBody: {
            name: file.originalname,
            mimeType: file.mimetype,
            parents: [parentFolderId],
        },
        media: {
            mimeType: file.mimetype,
            body: new Readable({
                read() {
                    this.push(file.buffer);
                    this.push(null);
                },
            }),
        },
        fields: "id",
    };

    try {
        const response = await drive.files.create(fileMetadata);
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
