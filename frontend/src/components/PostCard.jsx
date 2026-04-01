import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';
import './PostCard.css';

const PostCard = ({ post, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const isLiked = post.likes?.includes(user?.userId);
  const isOwner = post.userId === user?.userId;

  const handleLike = async () => {
    try {
      const res = await API.post(`/posts/${post.id}/like`);
      if (onUpdate) onUpdate(res.data);
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${post.id}`);
      if (onDelete) onDelete(post.id);
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.userId}`} className="post-author">
          <div className="avatar-sm">{post.username?.charAt(0).toUpperCase()}</div>
          <div>
            <span className="post-username">{post.username}</span>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
        </Link>
        {isOwner && (
          <button onClick={handleDelete} className="btn-delete" title="Delete post">
            &times;
          </button>
        )}
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-actions">
        <button onClick={handleLike} className={`btn-action ${isLiked ? 'liked' : ''}`}>
          <span className="action-icon">{isLiked ? '♥' : '♡'}</span>
          <span>{post.likes?.length || 0}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className="btn-action">
          <span className="action-icon">💬</span>
          <span>Comments</span>
        </button>
      </div>

      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
};

export default PostCard;
