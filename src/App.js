import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddCustomer from './components/AddCustomer';
import QRScanner from './components/QRScanner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <Link to="/">Milkboy App</Link>
          </div>
          <div className="navbar-links">
            <Link to="/add-customer" className="nav-link">Add Customer</Link>
            <Link to="/" className="nav-link">Scanner</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<QRScanner />} />
          <Route path="/add-customer" element={<AddCustomer />} />
        </Routes>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;