import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthAPI } from "../../api/auth";

const ResetPasswordForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetToken = searchParams.get("resetToken");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetToken) {
      setMessage("Invalid or missing reset token.");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setMessage(passwordValidation);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await AuthAPI.resetPassword(resetToken, password);
      if (response.error) {
        setMessage(response.error);
      } else {
        setMessage("Password successfully reset! Redirecting to login...");
        setIsSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <div className="auth-container">
        <h2>Invalid Reset Link</h2>
        <p>This password reset link is invalid or has expired.</p>
        <button onClick={() => navigate("/login")}>Return to Login</button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading || isSuccess}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading || isSuccess}
        />
        <button type="submit" disabled={isLoading || isSuccess}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {message && (
        <p className={isSuccess ? "success-message" : "error-message"}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPasswordForm;
