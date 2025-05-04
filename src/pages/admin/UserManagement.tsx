import React, { useState, useEffect } from 'react';
import { getUsers, banUser, unbanUser, deleteUser, User } from '../../firebase/admin';
import UserList from '../../components/ui/UserList';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (loadMore = false) => {
    try {
      setIsLoading(true);
      const data = await getUsers(loadMore ? lastDoc : null);
      
      if (loadMore) {
        setUsers([...users, ...data.users]);
      } else {
        setUsers(data.users);
      }
      
      setLastDoc(data.lastDoc);
      setHasMore(data.users.length === 10); // Assuming page size is 10
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user actions
  const handleBanUser = async (uid: string) => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      try {
        await banUser(uid);
        // Update local state
        setUsers(users.map(user => 
          user.uid === uid ? { ...user, status: 'banned' } : user
        ));
      } catch (error) {
        console.error('Error banning user:', error);
        alert('Failed to ban user');
      }
    }
  };

  const handleUnbanUser = async (uid: string) => {
    try {
      await unbanUser(uid);
      // Update local state
      setUsers(users.map(user => 
        user.uid === uid ? { ...user, status: 'active' } : user
      ));
    } catch (error) {
      console.error('Error unbanning user:', error);
      alert('Failed to unban user');
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(uid);
        // Update local state
        setUsers(users.filter(user => user.uid !== uid));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">View and manage user accounts</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">All Users</h2>
        
        <UserList 
          users={users} 
          onBan={handleBanUser} 
          onUnban={handleUnbanUser} 
          onDelete={handleDeleteUser}
          isLoading={isLoading}
        />
        
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={() => loadUsers(true)}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;