import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', { username, password });
      alert(response.data.message);
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="form-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-input"
      />
      <button onClick={handleRegister} className="form-button">
        Register
      </button>
      <Link to="/login" className="link-button">Already have an account? Log in</Link>
    </div>
  );
}

export default Register;

