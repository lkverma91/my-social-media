import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  if (loading) {
    return <div className="loading-state">Loading your feed...</div>;
  }

  return (
    <div className="home-page">
      <CreatePost onPostCreated={handlePostCreated} />

      {posts.length === 0 ? (
        <div className="empty-feed">
          <h2>Your feed is empty</h2>
          <p>Follow people from the Explore page to see their posts here, or create your first post above!</p>
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
  );
};

export default Home;
