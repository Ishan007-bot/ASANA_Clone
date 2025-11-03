import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
// Use API-based context when backend is available, fallback to local context
// Default to false for local development unless explicitly enabled
const USE_API = import.meta.env.VITE_USE_API === 'true';
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
              <Route path="/login" element={<Login />} />
              <Route path="/login-password" element={<LoginPassword />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/tell-us-about-work" element={<TellUsAboutWork />} />
              <Route path="/what-tools-do-you-use" element={<WhatToolsDoYouUse />} />
              <Route path="/setup-first-project" element={<SetupFirstProject />} />
              <Route path="/setup-tasks" element={<SetupTasks />} />
              <Route path="/setup-sections" element={<SetupSections />} />
              <Route path="/setup-layout" element={<SetupLayout />} />
              <Route path="/setup-invite" element={<SetupInvite />} />
              <Route path="/home" element={<Home />} />
              <Route path="/my-tasks" element={<MyTasks />} />
              <Route path="/projects" element={<BrowseProjects />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/reporting" element={<Reporting />} />
              <Route path="/portfolios" element={<Portfolios />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/new-project" element={<NewProject />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </TaskProviderWrapper>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

