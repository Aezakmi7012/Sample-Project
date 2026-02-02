import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        credentials: 'include'
      });
      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        }, 2000);
        return;
      }

      if (data.success) {
        setPosts(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/create-post')}>Create Post</button>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="posts-grid">
        {posts.length === 0 ? (
          <p className="empty">No posts yet. Create your first post!</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{truncateText(post.content)}</p>
              <button 
                onClick={() => navigate(`/post/${post.id}`)} 
                className="btn-link"
              >
                Read more →
              </button>
              <div className="post-meta">
                <small>By: {post.author.username}</small>
                <small>{new Date(post.createdAt).toLocaleDateString()}</small>
              </div>
              {currentUser.id === post.authorId && (
                <div className="post-actions">
                  <button 
                    onClick={() => navigate(`/edit-post/${post.id}`)} 
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => navigate(`/post/${post.id}`)} 
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
