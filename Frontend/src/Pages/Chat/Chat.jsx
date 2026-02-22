import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./Chat.css";

const Chat = () => {
  const { newChat, prevChats } = useContext(ChatContext);
  const [typingText, setTypingText] = useState(null);

  const lastMessage = prevChats[prevChats.length - 1];
  const shouldType =
    lastMessage && lastMessage.role === "assistant";

  // Typing animation ONLY for last assistant message
  useEffect(() => {
    if (!shouldType) {
      setTypingText(null);
      return;
    }

    const words = lastMessage.content.split(" ");
    let index = 0;

    const interval = setInterval(() => {
      setTypingText(words.slice(0, index + 1).join(" "));
      index++;

      if (index >= words.length) {
        clearInterval(interval);
        setTypingText(null);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [lastMessage]);

  return (
    <div className="chat-page">
      {newChat && prevChats.length === 0 && (
  <div className="empty-chat">
    <h1>DSA_GPT</h1>
    <p>Learn DSA with Step by Step🚀</p>
  </div>
)}


      <div className="chat-messages">
        {prevChats.map((chat, index) => {
          const isLast = index === prevChats.length - 1;

          return (
            <MessageBubble
              key={index}
              chat={{
                ...chat,
                content:
                  isLast && typingText ? typingText : chat.content,
              }}
              isTyping={isLast && typingText}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Chat;

/* ---------------- MESSAGE BUBBLE ---------------- */

const MessageBubble = ({ chat }) => {
  const isUser = chat.role === "user";

  return (
    <div className={`message ${isUser ? "user" : "assistant"}`}>
      {isUser ? (
        <p>{chat.content}</p>
      ) : (
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          components={{
            code({ inline, className, children, ...props }) {
              return !inline ? (
                <div className="code-block">
                  <button
                    className="copy-btn"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        String(children)
                      )
                    }
                  >
                    Copy
                  </button>
                  <pre className={className}>
                    <code {...props}>{children}</code>
                  </pre>
                </div>
              ) : (
                <code className="inline-code">{children}</code>
              );
            },
          }}
        >
          {chat.content}
        </ReactMarkdown>
      )}
    </div>
  );
};
