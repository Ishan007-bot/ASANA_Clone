import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
// Use API-based context when backend is available, fallback to local context
// Default to true since backend is running, set VITE_USE_API=false to use local mock data
const USE_API = import.meta.env.VITE_USE_API !== 'false';
import { TaskProvider } from './context/TaskContext';
import { TaskProviderApi } from './context/TaskContextApi';
import type { ReactNode } from 'react';
import Login from './pages/Login';
import LoginPassword from './pages/LoginPassword';
import Welcome from './pages/Welcome';
import TellUsAboutWork from './pages/TellUsAboutWork';
import WhatToolsDoYouUse from './pages/WhatToolsDoYouUse';
import Home from './pages/Home';
import MyTasks from './pages/MyTasks';
import BrowseProjects from './pages/BrowseProjects';
import Inbox from './pages/Inbox';
import Reporting from './pages/Reporting';
import Portfolios from './pages/Portfolios';
import Goals from './pages/Goals';
import Search from './pages/Search';
import Profile from './pages/Profile';
import NewProject from './pages/NewProject';
import ProjectDetail from './pages/ProjectDetail';
import SetupFirstProject from './pages/SetupFirstProject';
import SetupTasks from './pages/SetupTasks';
import SetupSections from './pages/SetupSections';
import SetupLayout from './pages/SetupLayout';
import SetupInvite from './pages/SetupInvite';
import './App.css';

// Wrap with appropriate provider based on config
function TaskProviderWrapper({ children }: { children: ReactNode }) {
  if (USE_API) {
    return <TaskProviderApi>{children}</TaskProviderApi>;
  }
  return <TaskProvider>{children}</TaskProvider>;
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <TaskProviderWrapper>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/login-password" element={<LoginPassword />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/tell-us-about-work" element={<TellUsAboutWork />} />
              <Route path="/what-tools-do-you-use" element={<WhatToolsDoYouUse />} />
              
              {/* Protected routes */}
              <Route path="/setup-first-project" element={<ProtectedRoute><SetupFirstProject /></ProtectedRoute>} />
              <Route path="/setup-tasks" element={<ProtectedRoute><SetupTasks /></ProtectedRoute>} />
              <Route path="/setup-sections" element={<ProtectedRoute><SetupSections /></ProtectedRoute>} />
              <Route path="/setup-layout" element={<ProtectedRoute><SetupLayout /></ProtectedRoute>} />
              <Route path="/setup-invite" element={<ProtectedRoute><SetupInvite /></ProtectedRoute>} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><BrowseProjects /></ProtectedRoute>} />
              <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
              <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
              <Route path="/reporting" element={<ProtectedRoute><Reporting /></ProtectedRoute>} />
              <Route path="/portfolios" element={<ProtectedRoute><Portfolios /></ProtectedRoute>} />
              <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/new-project" element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </TaskProviderWrapper>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
