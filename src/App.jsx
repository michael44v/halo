import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { SurveyProvider } from './context/SurveyContext';
import SurveyContainer from './components/SurveyContainer';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <SurveyProvider>
      <Router>
        <header style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg)'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--text-h)' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>SurveyApp</Link>
          </div>
          <nav>
            <Link to="/" style={{
              marginRight: '16px',
              textDecoration: 'none',
              color: 'var(--accent)',
              fontWeight: '500'
            }}>Survey</Link>
            <Link to="/admin" style={{
              textDecoration: 'none',
              color: 'var(--text)',
              fontWeight: '500'
            }}>Admin Dashboard</Link>
          </nav>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<SurveyContainer />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        <footer style={{
          padding: '16px',
          borderTop: '1px solid var(--border)',
          fontSize: '14px',
          color: 'var(--text)',
          backgroundColor: 'var(--bg)'
        }}>
          &copy; {new Date().getFullYear()} SurveyApp. All rights reserved.
        </footer>
      </Router>
    </SurveyProvider>
  );
}

export default App;
