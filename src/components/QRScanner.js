import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import QrScanner from 'qr-scanner';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './QRScanner.css';

const apiUrl = 'https://milkboy-backend-<your-username>.koyeb.app/api';

function QRScanner() {
  const [customer, setCustomer] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const navigate = useNavigate();

  const initializeScanner = () => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      const qrScanner = new QrScanner(videoRef.current, async (result) => {
        try {
          const response = await axios.get(`${apiUrl}/customers/${result.data}`);
          setCustomer(response.data);
          qrScanner.stop();
        } catch (error) {
          setMessage('Error fetching customer: ' + (error.response?.data || error.message));
          toast.error('Error fetching customer');
        }
      }, { returnDetailedScanResult: true });
      qrScannerRef.current = qrScanner;
      qrScanner.start().catch((err) => {
        console.error('Error starting QR scanner:', err);
        setMessage('Failed to start QR scanner');
        toast.error('Failed to start QR scanner');
      });
      return qrScanner;
    }
  };

  useEffect(() => {
    const qrScanner = initializeScanner();
    const currentVideoRef = videoRef.current;

    return () => {
      if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
        qrScannerRef.current = null;
      }
      if (currentVideoRef) {
        currentVideoRef.srcObject = null;
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qty = parseFloat(quantity) || 0;
    try {
      await axios.post(`${apiUrl}/milk-records`, {
        customerId: customer.id,
        quantity: qty,
      });
      toast.success(`Recorded ${qty} liters for ${customer.name}`);
      setCustomer(null);
      setQuantity('');
      setMessage('');

      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      navigate('/', { replace: true });
    } catch (error) {
      setMessage('Error recording delivery: ' + (error.response?.data || error.message));
      toast.error('Error recording delivery');
    }
  };

  useEffect(() => {
    if (!customer && !qrScannerRef.current) {
      initializeScanner();
    }
  }, [customer]);

  return (
    <div className="qr-scanner-container">
      <h2 className="section-title">Scan QR Code</h2>
      {!customer ? (
        <video ref={videoRef} className="qr-video"></video>
      ) : (
        <form onSubmit={handleSubmit} className="qr-form">
          <div className="form-group">
            <p className="customer-info">Customer: {customer.name}</p>
            <label className="form-label">Milk Quantity (Liters)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Record Delivery
          </button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default QRScanner;