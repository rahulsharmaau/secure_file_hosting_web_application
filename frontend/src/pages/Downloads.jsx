import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Downloads() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchFiles = async () => {
      try {
        const res = await fetch('/api/public-files', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const data = await res.json();
        setFiles(data);
      } catch (err) {
        setMessage('Failed to load files.');
      }
    };

    fetchFiles();
  }, [navigate]);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="page-content">
      <h2>Downloads</h2>
      <p className="page-subtitle">All files uploaded by users</p>
      {message && <p className="msg-error">{message}</p>}
      {files.length === 0 ? (
        <p className="empty-state">No files have been uploaded yet.</p>
      ) : (
        <table className="file-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Size</th>
              <th>Uploaded At</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>{file.filename}</td>
                <td>{formatSize(file.size)}</td>
                <td>{new Date(file.uploaded_at).toLocaleString()}</td>
                <td>{file.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Downloads;
