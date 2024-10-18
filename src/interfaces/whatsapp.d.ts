import { Chat, Message } from 'whatsapp-web.js';

interface WChat {
  id: string;
  name: string;
  isGroup: boolean;
  unreadCount: number;
  timestamp: number;
  lastMessage: { viewed: boolean; body: string };
}

interface WWebChat extends Chat {
  lastMessage: { _data?: any; body: string };
}

interface WMessage {
  id: string;
  fromMe: boolean;
  viewed: boolean;
  hasMedia: boolean;
  body: string;
  timestamp: number;
  hasReaction: boolean;
}

interface WWebMessage extends Message {
  _data: any;
}
