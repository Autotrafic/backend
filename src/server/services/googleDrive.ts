import { google, drive_v3 } from "googleapis";
import fs from "fs";
import { googleDriveConfig } from "../../config";
import { Readable } from "stream";

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

export async function uploadFile(file: Express.Multer.File): Promise<string> {
    const fileMetadata: drive_v3.Params$Resource$Files$Create = {
        requestBody: {
            name: file.originalname,
            mimeType: file.mimetype,
            parents: ["12DuMuGw8FISLpz0RK-y02gfalwj07lNr"],
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
