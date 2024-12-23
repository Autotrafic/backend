import '../../loadEnvironment';
import axios from 'axios';
import { WWebChat, WWebMessage } from '../../interfaces/whatsapp';
import { parsePhoneNumberForWhatsApp, parsePhoneNumberForWhatsappId } from '../parsers/other';
import { getPreviousWhatsappMessages } from '../handlers/notifier';

const backendNotifications = process.env.SLACK_BACKEND_NOTIFICATIONS_WEBHOOK_URL;
const whatsMessagesWebhook = process.env.SLACK_WHATS_MESSAGES_WEBHOOK_URL;
const ordersWebhook = process.env.SLACK_ORDERS_WEBHOOK_URL;

const whatsappApi = process.env.AUTOTRAFIC_WHATSAPP_API;

export async function sendWhatsappMessage({ phoneNumber, message }: { phoneNumber: string; message: string }) {
  try {
    const formattedPhoneNumber = parsePhoneNumberForWhatsApp(phoneNumber);

    const endpoint = `${whatsappApi}/messages/send`;
    const options = { phoneNumber: formattedPhoneNumber, message };

    const response = await axios.post(endpoint, options);

    return response.data;
  } catch (error) {
    if (error.response.data) {
      throw new Error(`Error enviando el mensaje de whatsapp: ${error.response.data.error}`);
    } else {
      throw new Error(`Error enviando el mensaje de whatsapp: ${error.response.data.error}`);
    }
  }
}

export async function sendWhatsappMessageToAnyChatType({ chatId, message }: { chatId: string; message: string }) {
  try {
    const endpoint = `${whatsappApi}/messages/send-any-chat`;
    const options = { chatId, message };

    const response = await axios.post(endpoint, options);

    return response.data;
  } catch (error) {
    if (error.response.data) {
      throw new Error(`Error enviando el mensaje de whatsapp: ${error.response.data.error}`);
    } else {
      throw new Error(`Error enviando el mensaje de whatsapp: ${error.response.data.error}`);
    }
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

export async function getWhatsappChatMessages(phoneNumber: string): Promise<WWebMessage[]> {
  try {
    const chatId = parsePhoneNumberForWhatsappId(phoneNumber);

    const endpoint = `${whatsappApi}/messages/chat-messages/${chatId}`;
    const response = await axios.get(endpoint);

    return response.data.messages;
  } catch (error) {
    if (error?.response?.data?.message) {
      throw new Error(error?.response?.data?.message);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function searchRegexInWhatsappChat(phoneNumber: string, searchString: string) {
  const parsedPhoneNumber = parsePhoneNumberForWhatsApp(phoneNumber);

  const endpoint = `${whatsappApi}/messages/search-regex`;
  const options = { phoneNumber: parsedPhoneNumber, searchString };

  try {
    const response = await axios.post(endpoint, options);

    return response.data?.existsEquivalences;
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

export async function arePreviousWhatsappMessages(phoneNumber: string) {
  try {
    if (!phoneNumber) throw new Error(`No se ha podido comprobar si hay mensajes previos ya que no hay número de teléfono`);

    const previousMessages = await getPreviousWhatsappMessages(phoneNumber);

    return previousMessages.length > 0;
  } catch (error) {
    throw new Error(`Error consultando si hay mensajes previos con ${phoneNumber}`);
  }
}
