import React from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './UserCard.css';

const UserCard = ({ userData, onFollowChange }) => {
  const { user } = useAuth();
  const isFollowing = userData.followers?.includes(user?.userId);
  const isSelf = userData.id === user?.userId;

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await API.delete(`/users/${userData.id}/follow`);
      } else {
        await API.post(`/users/${userData.id}/follow`);
      }
      if (onFollowChange) onFollowChange();
    } catch (err) {
      console.error('Failed to follow/unfollow:', err);
    }
  };

  return (
    <div className="user-card">
      <Link to={`/profile/${userData.id}`} className="user-card-info">
        <div className="avatar-md">{userData.username?.charAt(0).toUpperCase()}</div>
        <div>
          <span className="user-card-name">{userData.username}</span>
          <span className="user-card-bio">{userData.bio || 'No bio yet'}</span>
          <span className="user-card-stats">
            {userData.followers?.length || 0} followers &middot; {userData.following?.length || 0} following
          </span>
        </div>
      </Link>
      {!isSelf && (
        <button
          onClick={handleFollow}
          className={`btn-follow ${isFollowing ? 'following' : ''}`}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
};

export default UserCard;
