import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import UserCard from '../components/UserCard';
import './Explore.css';

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading-state">Loading users...</div>;
  }

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h1>Explore</h1>
        <p>Discover people to follow</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
        />
      </div>

      <div className="users-list">
        {filteredUsers.length === 0 ? (
          <div className="no-users">
            <p>No users found</p>
          </div>
        ) : (
          filteredUsers.map(u => (
            <UserCard key={u.id} userData={u} onFollowChange={fetchUsers} />
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;
