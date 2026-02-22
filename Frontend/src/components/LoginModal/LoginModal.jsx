import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./LoginModal.css";

export default function LoginModal({ onClose }) {
  const { login } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const url = isSignup
        ? "http://localhost:8080/api/auth/signup"
        : "http://localhost:8080/api/auth/login";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Request failed");
      }

      // Signup success → switch to login
      if (isSignup) {
        setIsSignup(false);
        setMessage("Signup successful. Please login.");
        return;
      }

      // Login success
      const data = JSON.parse(text);
      login(email, data.token);
      onClose();

    } catch (err) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-backdrop" onClick={onClose}>
      <div
        className="login-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{isSignup ? "Create Account" : "Sign In"}</h2>

        <input
          type="email"
          placeholder="Email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {message && (
          <p
            className={`login-message ${
              message.toLowerCase().includes("success")
                ? "success"
                : "error"
            }`}
          >
            {message}
          </p>
        )}

        <button
          className="primary-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : isSignup
            ? "Sign Up"
            : "Login"}
        </button>

        <button
          className="secondary-btn"
          onClick={() => {
            setIsSignup(!isSignup);
            setMessage("");
          }}
        >
          {isSignup
            ? "Already have an account? Login"
            : "New user? Create account"}
        </button>
      </div>
    </div>
  );
}
