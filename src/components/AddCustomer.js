import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const apiUrl = 'https://milkboy-backend-<your-username>.koyeb.app/api';

function AddCustomer() {
  const [name, setName] = useState('');
  const [village, setVillage] = useState('Karempudi');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/customers`, { name, village });
      toast.success(`Customer ${response.data.name} added successfully!`);
      setName('');
      setVillage('Karempudi');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      setMessage('Error adding customer: ' + (error.response?.data || error.message));
      toast.error('Error adding customer');
    }
  };

  return (
    <div className="add-customer-container">
      <h2 className="section-title">Add Customer</h2>
      <form onSubmit={handleSubmit} className="add-customer-form">
        <div className="form-group">
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Village</label>
          <select
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="form-input"
            required
          >
            <option value="Karempudi">Karempudi</option>
            <option value="Pipakkana">Pipakkana</option>
            <option value="Ravichettu">Ravichettu</option>
          </select>
        </div>
        <button type="submit" className="submit-button">
          Add Customer
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AddCustomer;