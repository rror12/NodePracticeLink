import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        username: formData.username,
        password: formData.password
      });

      navigate('/');
    } catch (error) {
      console.error('Signup Error:', error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          {['fname','lname','email','username','password','confirmPassword'].map((field, index) => (
            <div className="input-group" key={index}>
              <input
                type={field.includes('password') ? 'password' : (field === 'email' ? 'email' : 'text')}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
              <label className={formData[field] ? 'active' : ''}>
                {field === 'fname' && 'First Name'}
                {field === 'lname' && 'Last Name'}
                {field === 'email' && 'Email'}
                {field === 'username' && 'Username'}
                {field === 'password' && 'Password'}
                {field === 'confirmPassword' && 'Confirm Password'}
              </label>
            </div>
          ))}
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
