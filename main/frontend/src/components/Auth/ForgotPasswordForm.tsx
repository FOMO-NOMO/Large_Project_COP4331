import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthAPI } from "../../api/auth";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await AuthAPI.forgotPassword(email);
      if (response.error) {
        setMessage(response.error);
      } else {
        setMessage("Password reset email sent! Please check your inbox and follow the instructions.");
        setIsSuccess(true);
      }
    } catch (err: any) {
      setMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <p>Enter your email address and we'll send you a link to reset your password.</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading || isSuccess}
        />
        <button type="submit" disabled={isLoading || isSuccess}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {message && (
        <p className={isSuccess ? "success-message" : "error-message"}>
          {message}
        </p>
      )}

      <div className="auth-links">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;