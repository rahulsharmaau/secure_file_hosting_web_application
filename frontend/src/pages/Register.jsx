import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    // Frontend validation
    if (!username || !email || !password) {
      setMessage('All fields are required.');
      setIsError(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Invalid email format.');
      setIsError(true);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setIsError(false);
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
      setIsError(true);
    }
  };

  return (
    <div className="form-card">
      <h2>Register</h2>
      {message && (
        <p className={isError ? 'msg-error' : 'msg-success'}>{message}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">Register</button>
      </form>
      <p className="form-footer">
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Register;
