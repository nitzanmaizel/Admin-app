import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CreateDocPage from './pages/CreateDocPage';
import UsersPage from './pages/UsersPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DocPage from './pages/DocPage';
import AnalyticsDocPage from './pages/AnalyticsDocPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/dashboard/users" element={<UsersPage />} />
        <Route path="/dashboard/doc/:docId" element={<DocPage />} />
        <Route path="/dashboard/doc/create" element={<CreateDocPage />} />
        <Route path="/dashboard/analytics/:docId" element={<AnalyticsDocPage />} />
      </Route>
    </Routes>
  );
};

export default App;
