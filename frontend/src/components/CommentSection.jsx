import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './CommentSection.css';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/posts/${postId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await API.post(`/posts/${postId}/comments`, { content });
      setComments([...comments, res.data]);
      setContent('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  if (loading) return <div className="comments-loading">Loading comments...</div>;

  return (
    <div className="comment-section">
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="comment-input"
        />
        <button type="submit" disabled={!content.trim()} className="btn-comment-send">
          Send
        </button>
      </form>

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <Link to={`/profile/${comment.userId}`} className="comment-avatar-sm">
              {comment.username?.charAt(0).toUpperCase()}
            </Link>
            <div className="comment-body">
              <Link to={`/profile/${comment.userId}`} className="comment-username">
                {comment.username}
              </Link>
              <p className="comment-text">{comment.content}</p>
            </div>
            {comment.userId === user?.userId && (
              <button onClick={() => handleDelete(comment.id)} className="btn-comment-delete">
                &times;
              </button>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="no-comments">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
