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

