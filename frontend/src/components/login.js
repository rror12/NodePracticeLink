import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      // console.log(response.data);
      

      if (response.data.success) {
        setUser(response.data.user); // Save user info
        // After successful login
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token); // Save JWT token
        localStorage.setItem('userId', response.data.user._id);
        // console.log("Saved userId:", response.data.user);
        navigate('/notes');
      } else {
        alert(response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        {!user ? (
          <>
            <h2>SIGN IN</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label className={username ? 'active' : ''}>Username</label>
              </div>
              <div className="input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className={password ? 'active' : ''}>Password</label>
              </div>
              <div className="options">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot Password?</a>
              </div>
              <button type="submit" className="login-btn">Login</button>
            </form>
            <p style={{ marginTop: '15px' }}>
              Don’t have an account? <Link to="/signup" className="signup-link">Create New Account</Link>
            </p>
          </>
        ) : (
          <h2>Hello {user.fname} {user.lname}</h2>
        )}
      </div>
    </div>
  );
}

export default Login;
