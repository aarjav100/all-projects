import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Login, Signup } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { TrainDetails } from './pages/TrainDetails';

const Home = () => <Navigate to="/dashboard" />;
const LiveTracking = () => <Navigate to="/search" />;
const Favorites = () => <div className="p-8"><h1>Favorites</h1><p>Work in progress</p></div>;
const Profile = () => <div className="p-8"><h1>Profile</h1><p>Work in progress</p></div>;
const NotFound = () => <div className="p-8"><h1>404 Not Found</h1></div>;



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-cosmic-gradient">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/train/:id" element={<ProtectedRoute><TrainDetails /></ProtectedRoute>} />
            <Route path="/track/:id" element={<ProtectedRoute><LiveTracking /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
       <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse"></div>
       </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default App;
