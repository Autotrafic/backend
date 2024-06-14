import { Mongoose } from 'mongoose';

export interface MongoStoreOptions {
  mongoose: Mongoose;
  session?: string;
  path?: string;
}

export declare class MongoStore {
  constructor(options: MongoStoreOptions);
  
  sessionExists(options: { session: string }): Promise<boolean>;
  save(options: { session: string; path: string }): Promise<void>;
  extract(options: { session: string; path: string }): Promise<void>;
  delete(options: { session: string }): Promise<void>;
}
