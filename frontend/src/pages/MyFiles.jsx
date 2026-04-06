import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MyFiles() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchMyFiles();
  }, [navigate]);

  const fetchMyFiles = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/my-files', {
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
      setIsError(true);
    }
  };

  const handleDelete = async (fileId) => {
    const token = localStorage.getItem('token');
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('File deleted successfully.');
        setIsError(false);
        setFiles(files.filter((f) => f.id !== fileId));
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
      setIsError(true);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="page-content">
      <h2>My Files</h2>
      <p className="page-subtitle">Files uploaded by you</p>
      {message && (
        <p className={isError ? 'msg-error' : 'msg-success'}>{message}</p>
      )}
      {files.length === 0 ? (
        <p className="empty-state">You haven't uploaded any files yet.</p>
      ) : (
        <table className="file-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Size</th>
              <th>Uploaded At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>{file.filename}</td>
                <td>{formatSize(file.size)}</td>
                <td>{new Date(file.uploaded_at).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyFiles;
