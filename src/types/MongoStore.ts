import * as fs from 'fs';
import { Db, MongoClient, GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

interface Store {
    sessionExists(options: { session: string }): Promise<boolean>;
    save(options: { session: string }): Promise<void>;
    extract(options: { session: string, path: string }): Promise<void>;
    delete(options: { session: string }): Promise<void>;
}

interface MongoStoreOptions {
    mongoose: MongoClient;
    session: string;
    path?: string;
}

class MongoStore implements Store {

    constructor() {
        if (!mongoose) throw new Error('A valid Mongoose instance is required for MongoStore.');
    }

    public async sessionExists(options: { session: string }): Promise<boolean> {
        const multiDeviceCollection = mongoose.connection.db.collection(`whatsapp-${options.session}.files`);
        const hasExistingSession = await multiDeviceCollection.countDocuments();
        return !!hasExistingSession;
    }

    public async save(options: { session: string }): Promise<void> {
        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: `whatsapp-${options.session}`
        });
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(`${options.session}.zip`)
                .pipe(bucket.openUploadStream(`${options.session}.zip`))
                .on('error', err => reject(err))
                .on('close', () => resolve());
        });
        await this.deletePrevious(options);
    }

    public async extract(options: { session: string, path: string }): Promise<void> {
        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: `whatsapp-${options.session}`
        });
        return new Promise<void>((resolve, reject) => {
            bucket.openDownloadStreamByName(`${options.session}.zip`)
                .pipe(fs.createWriteStream(options.path))
                .on('error', err => reject(err))
                .on('close', () => resolve());
        });
    }

    public async delete(options: { session: string }): Promise<void> {
        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: `whatsapp-${options.session}`
        });
        const documents = await bucket.find({
            filename: `${options.session}.zip`
        }).toArray();

        documents.map(async doc => {
            return bucket.delete(doc._id);
        });
    }

    private async deletePrevious(options: { session: string }): Promise<void> {
        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: `whatsapp-${options.session}`
        });
        const documents = await bucket.find({
            filename: `${options.session}.zip`
        }).toArray();
        if (documents.length > 1) {
            const oldSession = documents.reduce((a, b) => a.uploadDate < b.uploadDate ? a : b);
            return bucket.delete(oldSession._id);
        }
    }
}

export = MongoStore;
