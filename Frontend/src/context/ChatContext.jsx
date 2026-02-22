import { createContext, useState } from "react";

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [allThreads, setAllThreads] = useState([]);
  const [currThreadId, setCurrThreadId] = useState(null);
  const [prevChats, setPrevChats] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newChat, setNewChat] = useState(true);

  return (
    <ChatContext.Provider
      value={{
        allThreads,
        setAllThreads,
        currThreadId,
        setCurrThreadId,
        prevChats,
        setPrevChats,
        prompt,
        setPrompt,
        newChat,
        setNewChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
