import React, { useState, useEffect } from 'react';
import { getUserActivities, UserActivity } from '../../firebase/admin';
import { format } from 'date-fns';

const UserActivities: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [filterUserId, setFilterUserId] = useState<string>('');

  // Load activities
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async (loadMore = false) => {
    try {
      setIsLoading(true);
      const data = await getUserActivities(loadMore ? lastDoc : null, 20, filterUserId || null);
      
      if (loadMore) {
        setActivities([...activities, ...data.activities]);
      } else {
        setActivities(data.activities);
      }
      
      setLastDoc(data.lastDoc);
      setHasMore(data.activities.length === 20); // Assuming page size is 20
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterUserId(e.target.value);
  };

  // Apply filter
  const applyFilter = () => {
    loadActivities(false);
  };

  // Format date for display
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    try {
      if (timestamp.toDate) {
        return format(timestamp.toDate(), 'MMM dd, yyyy HH:mm:ss');
      }
      return 'Invalid date';
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Activities</h1>
        <p className="text-gray-600">Track user actions and events</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-auto flex-grow">
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by User ID
            </label>
            <input
              type="text"
              id="userId"
              value={filterUserId}
              onChange={handleFilterChange}
              placeholder="Enter user ID to filter"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={applyFilter}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 md:self-end"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Activity Log</h2>
        
        {isLoading && activities.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : activities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.userId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {activity.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimestamp(activity.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 max-w-xs break-words">
                      {activity.details ? JSON.stringify(activity.details, null, 2) : 'No details'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No activities found.</p>
          </div>
        )}
        
        {activities.length > 0 && !isLoading && hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={() => loadActivities(true)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Load More
            </button>
          </div>
        )}
        
        {isLoading && activities.length > 0 && (
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivities;