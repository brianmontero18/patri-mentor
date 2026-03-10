import { useState } from "react";
import type { AppScreen } from "./types";
import { Landing } from "./components/Landing";
import { ChatView } from "./components/ChatView";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("landing");

  return (
    <>
      <div className="bg-gradient" />
      <div className="app-content">
        {screen === "landing" && <Landing onStart={() => setScreen("chat")} />}
        {screen === "chat" && <ChatView />}
      </div>
    </>
  );
}
