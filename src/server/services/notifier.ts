import '../../loadEnvironment';
import axios from 'axios';
import { WWebChat, WWebMessage } from '../../interfaces/whatsapp';

const backendNotifications = process.env.SLACK_BACKEND_NOTIFICATIONS_WEBHOOK_URL;
const whatsMessagesWebhook = process.env.SLACK_WHATS_MESSAGES_WEBHOOK_URL;
const ordersWebhook = process.env.SLACK_ORDERS_WEBHOOK_URL;

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

export async function getAllWhatsappChats(): Promise<WWebChat[]> {
  const endpoint = `${whatsappApi}/messages/chats`;

  try {
    const response = await axios.get(endpoint);
    return response.data.chats;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getWhatsappChatMessages(chatId: string): Promise<WWebMessage[]> {
  const endpoint = `${whatsappApi}/messages/chat-messages/${chatId}`;

  try {
    const response = await axios.get(endpoint);

    return response.data.messages;
  } catch (error) {
    throw new Error(error);
  }
}

export default async function notifySlack(message: string, channel?: 'whatsapp_messages' | 'orders') {
  let channelWebhook = backendNotifications;

  if (channel === 'whatsapp_messages') channelWebhook = whatsMessagesWebhook;
  if (channel === 'orders') channelWebhook = ordersWebhook;

  try {
    await axios.post(channelWebhook, { text: message });
  } catch (error) {
    console.error('Error sending notification to Slack:', error.message);
  }
}
