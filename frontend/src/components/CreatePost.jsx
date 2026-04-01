import React, { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await API.post('/posts', { content });
      setContent('');
      if (onPostCreated) onPostCreated(res.data);
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <div className="create-post-header">
        <div className="avatar">{user?.username?.charAt(0).toUpperCase()}</div>
        <form onSubmit={handleSubmit} className="create-post-form">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows="3"
          />
          <button type="submit" disabled={!content.trim() || loading} className="btn-post">
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
