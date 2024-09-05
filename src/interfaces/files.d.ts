export interface UploadFilesBody {
    files: Express.Multer.File[];
    body: {
        orderData: {}
    }
}