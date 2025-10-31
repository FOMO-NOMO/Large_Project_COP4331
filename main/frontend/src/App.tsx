// Component: Main App
// Purpose: Root application component with routing and authentication setup
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Survey from './pages/Survey';
import Feed from './pages/Feed';
import Groups from './pages/Groups';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import LoadingSpinner from './components/LoadingSpinner';
import PostCard from './components/Feed/PostCard';

<<<<<<< HEAD
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading, isNewUser } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // Redirect new users to survey, existing users to feed
    return <Navigate to={isNewUser ? "/survey" : "/feed"} replace />;
  }

  return <>{children}</>;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-container">
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            <Route path="/reset-password" element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } />

            {/* Protected routes */}
            <Route path="/survey" element={
              <ProtectedRoute>
                <Survey />
              </ProtectedRoute>
            } />

            <Route path="/feed" element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } />

            <Route path="/groups" element={
              <ProtectedRoute>
                <Groups />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="*" element={<Navigate to="/feed" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
=======
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import SignUp from "./components/SignUp";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/cards" element={<CardPage />}/>
      </Routes>
    </BrowserRouter>
      );
}

export default App;
>>>>>>> 294629c6e2c92cc3ea407a75375a0427dae413c3
