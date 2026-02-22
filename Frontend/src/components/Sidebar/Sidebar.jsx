import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../LoginModal/LoginModal";
import DSASection from "../DSASection/DSASection";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const {
    setNewChat,
    setPrompt,
    setReply,
    setPrevChats,
    setCurrThreadId,
  } = useContext(ChatContext);

  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setPrevChats([]);
    setCurrThreadId(null);
    onClose?.();
  };

  return (
    <>
     <aside className={`sidebar ${isOpen ? "open" : ""}`}>

  {/* TOP SECTION */}
  <div className="sidebar-top">

    <button className="new-chat-btn" onClick={createNewChat}>
      ➕ New Chat
    </button>

    <DSASection />

  </div>

  {/* BOTTOM SECTION */}
  <div className="sidebar-bottom">

    <div className="auth-section">
      {user ? (
        <>
          <p className="user-email">{user}</p>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <button
          className="login-btn"
          onClick={() => setShowLogin(true)}
        >
          Sign In
        </button>
      )}
    </div>

    <footer className="sidebar-footer">
      Built with ❤️ by Ravi Teja
    </footer>

  </div>

</aside>


      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Sidebar;
