
export interface MetricLog {
  id: string;
  date: string;
  weight: number;
  wellBeing: number; // 1-10
  sleepQuality: number; // 1-10
  progressNote: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AppState {
  logs: MetricLog[];
  chatHistory: Message[];
}
