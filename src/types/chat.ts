export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  date: Date;
  messages: ChatMessage[];
}

export interface ChatError {
  error: boolean;
  message: string;
  code?: string;
}
