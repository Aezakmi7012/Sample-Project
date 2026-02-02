import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import ViewPost from './pages/ViewPost';
import EditPost from './pages/EditPost';
import './App.css';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/create-post" 
          element={isAuthenticated() ? <CreatePost /> : <Navigate to="/" />} 
        />
        <Route 
          path="/post/:id" 
          element={isAuthenticated() ? <ViewPost /> : <Navigate to="/" />} 
        />
        <Route 
          path="/edit-post/:id" 
          element={isAuthenticated() ? <EditPost /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
