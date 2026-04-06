import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
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
    if (!email || !password) {
      setMessage('All fields are required.');
      setIsError(true);
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Login successful! Redirecting...');
        setIsError(false);
        setTimeout(() => {
          navigate('/upload');
          window.location.reload();
        }, 1500);
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
      <h2>Login</h2>
      {message && (
        <p className={isError ? 'msg-error' : 'msg-success'}>{message}</p>
      )}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn-primary">Login</button>
      </form>
      <p className="form-footer">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;
