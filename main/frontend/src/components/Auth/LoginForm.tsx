// Component: Login Form
// Purpose: User login form component
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

interface LoginFormProps {
  onSubmit?: (credentials: any) => void;
  loading?: boolean;
}

export default function LoginForm(props: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    login: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.login || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(formData);
      // If we get here, login was successful
      navigate("/survey"); // Navigate to survey/feed after login
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <p>Sign in to your account</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="login"
          placeholder="Username or Email"
          value={formData.login}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="auth-links">
        <Link to="/forgot-password">Forgot Password?</Link>
        <span> • </span>
        <Link to="/register">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
}
