import { useContext, useRef, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import Chat from "../../Pages/Chat/Chat";
import { ScaleLoader } from "react-spinners";
import "./ChatWindow.css";

const ChatWindow = ({ onMenuClick }) => {
  const {
    prompt,
    setPrompt,
    prevChats,
    setPrevChats,
    reply,
    setReply,
    currThreadId,
    setNewChat,
  } = useContext(ChatContext);

  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const sendMessage = async () => {
    if (!prompt.trim()) return;

    setNewChat(false);
    setLoading(true);

    setPrevChats((prev) => [
      ...prev,
      { role: "user", content: prompt },
    ]);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
        }),
      });

      const data = await res.json();
      setPrevChats((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
      setReply(data.reply);
    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, loading]);

  return (
    <div className="chat-window">
      <div className="chat-navbar">
        <button className="menu-btn" onClick={onMenuClick}>☰</button>
        <h2 style={{margin:'5px'}}>DSA_GPT</h2>
      </div>

      <div className="chat-body">
  <div className="chat-content">
    <Chat />
    {loading && <ScaleLoader color="#aaa" />}
    <div ref={endRef} />
  </div>
</div>


      <div className="chat-input">
        <input
          placeholder="Ask anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
};

export default ChatWindow;
