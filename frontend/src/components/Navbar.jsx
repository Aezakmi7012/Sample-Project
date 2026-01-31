import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#333', color: 'white', padding: '15px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          Blog
        </Link>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user ? (
            <>
              <span>Welcome, {user.username}</span>
              {user.role === 'ADMIN' && <span style={{ background: '#dc3545', padding: '2px 8px', borderRadius: '3px', fontSize: '12px' }}>Admin</span>}
              <button
                onClick={handleLogout}
                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
