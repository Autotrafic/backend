import { WChat, WMessage, WWebChat, WWebMessage } from '../../interfaces/whatsapp';

export function parseFullWhatsChat(fullChat: WWebChat): WChat {
  return {
    id: fullChat.id._serialized,
    name: fullChat.name,
    isGroup: fullChat.isGroup,
    unreadCount: fullChat.unreadCount,
    timestamp: fullChat.timestamp,
    lastMessage: { viewed: fullChat.lastMessage?._data?.viewed, body: fullChat.lastMessage?.body },
  };
}

export function parseFullWhatsMessage(fullMessage: WWebMessage): WMessage {
  return {
    id: fullMessage.id._serialized,
    fromMe: fullMessage.id.fromMe,
    viewed: fullMessage?._data?.viewed,
    hasMedia: fullMessage.hasMedia,
    body: fullMessage?.body,
    timestamp: fullMessage.timestamp,
    hasReaction: fullMessage.hasReaction,
  };
}
