import { google, drive_v3 } from "googleapis";
import fs from "fs";
import { googleDriveConfig } from "../config";

interface File {
    originalname: string;
    mimetype: string;
    path: string;
}

const key = JSON.parse(fs.readFileSync(googleDriveConfig.keyFilePath, "utf8"));
const jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    googleDriveConfig.scopes
);
const drive = google.drive({ version: "v3", auth: jwtClient });

export async function uploadFile(file: File): Promise<string> {
    const fileMetadata: drive_v3.Params$Resource$Files$Create = {
        requestBody: {
            name: file.originalname,
            mimeType: file.mimetype,
        },
        media: {
            mimeType: file.mimetype,
            body: fs.createReadStream(file.path),
        },
        fields: "id",
    };

    try {
        const response = await drive.files.create(fileMetadata);
        fs.unlinkSync(file.path);
        return response.data.id!;
    } catch (error) {
        console.error("Failed to upload file:", error);
        fs.unlinkSync(file.path);
        throw error;
    }
}
