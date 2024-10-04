const shortener = require('node-url-shortener');
import { requestShortenUrl } from '.';
import notifySlack from './notifier';

export async function shortUrl(urlToShort: string): Promise<string> {
  if (!urlToShort) return '';

  try {
    const shortedUrl = await requestShortenUrl(urlToShort);
    return shortedUrl;
  } catch (error) {
    notifySlack(`Error shorting shipping tracking url. The shorten service has failed: ${error}`);
    return urlToShort;
  }
}
