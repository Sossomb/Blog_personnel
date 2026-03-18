import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import Friends from './pages/Friends';
import Comments from './pages/Comments';
import RequireAuth from './components/RequireAuth';

function App({ mode, onToggleTheme }) {
  return (
    <>
      <Navbar mode={mode} onToggleTheme={onToggleTheme} />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/articles"
            element={
              <RequireAuth>
                <Articles />
              </RequireAuth>
            }
          />
          <Route
            path="/friends"
            element={
              <RequireAuth>
                <Friends />
              </RequireAuth>
            }
          />
          <Route
            path="/comments"
            element={
              <RequireAuth>
                <Comments />
              </RequireAuth>
            }
          />
          <Route
            path="*"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
