import '../../loadEnvironment';
import axios, { Method } from 'axios';
import { SENDCLOUD_API, SHORT_URL_API } from '../../utils/constants';
import notifySlack from './notifier';

export interface SendcloudRequestOptions {
  endpoint: string;
  method: Method;
  body?: CreateLabelExportBody;
  isResponseBuffer?: boolean;
}

const username = process.env.SENDCLOUD_PUBLIC_KEY;
const password = process.env.SENDCLOUD_SECRET_KEY;

export async function makeSendcloudRequest({ endpoint, method, body, isResponseBuffer }: SendcloudRequestOptions) {
  try {
    const response = await axios({
      url: `${SENDCLOUD_API}${endpoint}`,
      method: method,
      data: body,
      auth: {
        username: username,
        password: password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: isResponseBuffer ? 'arraybuffer' : 'json',
    });

    return response.data;
  } catch (error) {
    console.error('Error making sendcloud request:', error);
    notifySlack(`Error making sendcloud request:
      Endpoint: ${SENDCLOUD_API}${endpoint}
      Method: ${method},
      Body: ${JSON.stringify(body)}`);
    throw error;
  }
}

export async function requestShortenUrl(urlToShorten: string): Promise<string> {
  try {
    const response = await axios.post(
      SHORT_URL_API,
      {
        url: urlToShorten,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.result_url;
  } catch (error) {
    console.error(`Error shortening URL: ${error.message}`);
    throw new Error(`Error shortening URL: ${error.message}`);
  }
}
