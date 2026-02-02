import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
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
        setFormData({
          title: data.data.title,
          content: data.data.content
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch post');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        setError('You are not authorized to edit this post.');
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        }, 2000);
        return;
      }

      if (data.success) {
        navigate(`/post/${id}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>Edit Post</h1>
          <button onClick={() => navigate(`/post/${id}`)} className="btn-secondary">
            Cancel
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength="200"
              required
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              maxLength="10000"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
