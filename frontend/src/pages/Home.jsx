import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAll();
      setPosts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postAPI.delete(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Blog Posts</h1>
        {user && (
          <Link to="/create" style={{ padding: '10px 20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Create Post
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No posts yet</p>
      ) : (
        posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '4px' }}>
            <h2>{post.title}</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
              By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p style={{ marginBottom: '15px' }}>{post.content.substring(0, 200)}{post.content.length > 200 ? '...' : ''}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to={`/post/${post.id}`} style={{ color: '#007bff' }}>Read More</Link>
              {user && user.id === post.author.id && (
                <>
                  <Link to={`/edit/${post.id}`} style={{ color: '#28a745' }}>Edit</Link>
                  <button onClick={() => handleDelete(post.id)} style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Delete
                  </button>
                </>
              )}
              {user && user.role === 'ADMIN' && user.id !== post.author.id && (
                <button onClick={() => handleDelete(post.id)} style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Delete (Admin)
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
