import '../../loadEnvironment';
import axios from 'axios';

const slackWebhook = process.env.SLACK_WEBHOOK_URL;

const whatsappApi = process.env.AUTOTRAFIC_WHATSAPP_API;

export async function sendWhatsappMessage({ phoneNumber, message }: { phoneNumber: string; message: string }) {
  const endpoint = `${whatsappApi}/messages/send`;
  const options = { phoneNumber, message };

  try {
    const response = await axios.post(endpoint, options);

    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}

export default async function notifySlack(message: string) {
  const notifyMessage = message ?? 'Unknown message error.';

  try {
    await axios.post(slackWebhook, {
      text: notifyMessage,
    });
  } catch (error) {
    console.error('Error sending notification to Slack:', error);
  }
}
