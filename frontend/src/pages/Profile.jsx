import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');

  const isOwn = id === user?.userId;
  const isFollowing = profile?.followers?.includes(user?.userId);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/users/${id}`);
      setProfile(res.data);
      setBio(res.data.bio || '');
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await API.get(`/posts/user/${id}`);
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  const handleSaveBio = async () => {
    try {
      const res = await API.put(`/users/${id}`, { bio });
      setProfile(res.data);
      setEditingBio(false);
    } catch (err) {
      console.error('Failed to update bio:', err);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await API.delete(`/users/${id}/follow`);
      } else {
        await API.post(`/users/${id}/follow`);
      }
      fetchProfile();
    } catch (err) {
      console.error('Failed to follow/unfollow:', err);
    }
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  if (loading) {
    return <div className="loading-state">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="loading-state">User not found</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.username?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          {editingBio ? (
            <div className="bio-edit">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about yourself..."
                rows="2"
              />
              <div className="bio-edit-actions">
                <button onClick={handleSaveBio} className="btn-save">Save</button>
                <button onClick={() => setEditingBio(false)} className="btn-cancel">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="profile-bio">
              {profile.bio || (isOwn ? 'Click edit to add a bio' : 'No bio yet')}
            </p>
          )}
          <div className="profile-stats">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{profile.followers?.length || 0}</strong> followers</span>
            <span><strong>{profile.following?.length || 0}</strong> following</span>
          </div>
        </div>
        <div className="profile-actions">
          {isOwn ? (
            !editingBio && (
              <button onClick={() => setEditingBio(true)} className="btn-edit-profile">
                Edit Bio
              </button>
            )
          ) : (
            <button
              onClick={handleFollow}
              className={`btn-follow-profile ${isFollowing ? 'following' : ''}`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      <div className="profile-posts">
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <div className="empty-posts">
            <p>No posts yet</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handlePostDelete}
              onUpdate={handlePostUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
