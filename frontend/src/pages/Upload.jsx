import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Decode JWT payload to get user email
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserEmail(payload.email);
    } catch (err) {
      // Token is invalid
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!file) {
      setMessage('Please select a file to upload.');
      setIsError(true);
      return;
    }

    // Frontend validation: file type
    const allowedTypes = ['application/pdf', 'video/mp4'];
    const allowedExtensions = ['.pdf', '.mp4'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(ext)) {
      setMessage('Only .pdf and .mp4 files are supported.');
      setIsError(true);
      return;
    }

    // Frontend validation: file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      setMessage('File size exceeds the 20MB limit.');
      setIsError(true);
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('File uploaded successfully!');
        setIsError(false);
        setFile(null);
        e.target.reset();
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
      <h2>Upload File</h2>
      {userEmail && (
        <p className="msg-success">Logged in as: {userEmail}</p>
      )}
      {message && (
        <p className={isError ? 'msg-error' : 'msg-success'}>{message}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select a file (.pdf or .mp4, max 20MB)</label>
          <input
            type="file"
            accept=".pdf,.mp4"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn-primary">Upload</button>
      </form>
    </div>
  );
}

export default Upload;
