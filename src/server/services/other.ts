const shortener = require('node-url-shortener');
import notifySlack from './notifier';

export async function shortUrl(urlToShort: string): Promise<string> {
  if (!urlToShort) return '';

  return new Promise((resolve, reject) => {
    shortener.short(urlToShort, (err: any, shortUrl: string) => {
      if (err) {
        notifySlack(`Error while requesting shortened URL: ${err}`);
        resolve(urlToShort);
      } else {
        resolve(shortUrl);
      }
    });
  });
}
