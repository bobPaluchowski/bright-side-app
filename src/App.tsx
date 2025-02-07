import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Journal from './pages/Journal';
import Appointments from './pages/Appointments';
import Chat from './pages/Chat';
import Video from './pages/Video';
import Settings from './pages/Settings';
import MentorSelection from './components/MentorSelection/MentorSelection';
import ProtectedRoute from './components/ProtectedRoute';
import MainNavigation from './components/Navigation/MainNavigation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#F9F5F1]">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <MainNavigation />
                    <div className="md:ml-64">
                      <Home />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <>
                    <MainNavigation />
                    <div className="md:ml-64">
                      <Journal />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <>
                    <MainNavigation />
                    <div className="md:ml-64">
                      <Appointments />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <>
                    <MainNavigation />
                    <div className="md:ml-64">
                      <Chat />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/video"
              element={
                <ProtectedRoute>
                  <>
                    <MainNavigation />
                    <div className="md:ml-64">
                      <Video />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <>
                    <MainNavigation />
                    <div className="md:ml-64">
                      <Settings />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentor-selection"
              element={
                <ProtectedRoute>
                  <>
                    <MainNavigation />
                    <div className="md:ml-64">
                      <MentorSelection />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;