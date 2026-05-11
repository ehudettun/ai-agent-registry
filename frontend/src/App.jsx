import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import LookupPage from './pages/LookupPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'report':
        return <ReportPage />;
      case 'lookup':
        return <LookupPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <h1 onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>
            🔐 AI Agent Registry
          </h1>
          <ul className="nav-links">
            <li><button onClick={() => setCurrentPage('home')}>Home</button></li>
            <li><button onClick={() => setCurrentPage('report')}>Report Offense</button></li>
            <li><button onClick={() => setCurrentPage('lookup')}>Look Up Agent</button></li>
          </ul>
        </div>
      </nav>
      <main className="container">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
