import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import { ChatProvider } from "./context/ChatContext";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ChatProvider>
      <div className="app-layout">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <ChatWindow
          onMenuClick={() => setSidebarOpen(true)}
        />
      </div>
    </ChatProvider>
  );
}

export default App;
