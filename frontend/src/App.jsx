import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Downloads from './pages/Downloads';
import MyFiles from './pages/MyFiles';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/my-files" element={<MyFiles />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
