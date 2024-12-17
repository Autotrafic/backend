import { parseFullWhatsMessage } from '../parsers/whatsapp';
import { getWhatsappChatMessages } from '../services/notifier';

export async function getPreviousWhatsappMessages(phoneNumber: string) {
  const chatMessages = await getWhatsappChatMessages(phoneNumber);

  const formattedChatMessages = chatMessages.map((message) => parseFullWhatsMessage(message));

  return formattedChatMessages;
}
