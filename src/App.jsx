import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TeacherDashboard from './pages/TeacherDashboard';
import AttendancePage from './pages/AttendancePage';
import DiaryPage from './pages/DiaryPage';
import ParentPortal from './pages/ParentPortal';
import LoginPage from './pages/LoginPage';
import SetupPage from './pages/SetupPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (role, user = null) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
        } />

        <Route path="/" element={
          isAuthenticated ? <Layout onLogout={handleLogout} role={userRole} /> : <Navigate to="/login" replace />
        }>
          <Route index element={
            userRole === 'parent' ? <Navigate to="/parent" replace /> :
              userRole === 'admin' ? <Navigate to="/setup" replace /> :
                <TeacherDashboard currentUser={currentUser} />
          } />
          <Route path="attendance" element={<AttendancePage currentUser={currentUser} />} />
          <Route path="diary" element={<DiaryPage currentUser={currentUser} />} />
          <Route path="parent" element={<ParentPortal currentUser={currentUser} />} />
          <Route path="setup" element={
            userRole === 'admin' ? <SetupPage /> : <Navigate to="/" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
