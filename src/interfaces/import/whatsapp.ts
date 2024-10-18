import { Request } from 'express';

export interface SendWhatsappBody extends Request {
  body: {
    phoneNumber: string;
    message: string;
  };
}