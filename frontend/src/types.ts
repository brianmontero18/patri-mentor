export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type AppScreen = "landing" | "chat";
