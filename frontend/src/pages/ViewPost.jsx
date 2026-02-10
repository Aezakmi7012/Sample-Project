import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ViewPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
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
        setPost(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        alert('You are not authorized to delete this post.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        return;
      }

      if (data.success) {
        navigate('/dashboard');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container"><div className="error">{error}</div></div>;
  if (!post) return <div className="container">Post not found</div>;

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>{post.title}</h1>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            Back
          </button>
        </div>

        <div className="post-meta">
          <small>By: {post.author.username}</small>
          <small>{new Date(post.createdAt).toLocaleDateString()}</small>
        </div>

        <div className="post-content">
          <p>{post.content}</p>
        </div>

        {(currentUser.id === post.authorId || currentUser.role === 'ADMIN') && (
          <div className="post-actions">
            {currentUser.id === post.authorId && (
              <button onClick={() => navigate(`/edit-post/${post.id}`)} className="btn-edit">
                Edit
              </button>
            )}
            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewPost;
