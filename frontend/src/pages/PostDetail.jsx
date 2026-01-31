import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postAPI } from '../api';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getById(id);
      setPost(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
  if (!post) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Post not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}>
        ← Back
      </button>
      <h1>{post.title}</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
        {post.updatedAt !== post.createdAt && ` • Updated ${new Date(post.updatedAt).toLocaleDateString()}`}
      </p>
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
        {post.content}
      </div>
    </div>
  );
}
