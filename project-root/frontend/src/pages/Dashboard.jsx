import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser, restoreUser } from '../redux/userSlice.js';
import { getAllPosts } from '../redux/blogSlice.js';
import { fetchLogs } from '../redux/logsSlice'; // Make sure this path matches your logs slice

const Dashboard = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const users = useSelector((state) => state.user.users) || [];
  const loadingUsers = useSelector((state) => state.user.loading);
  const posts = useSelector((state) => state.blogs.posts) || [];
  const loadingPosts = useSelector((state) => state.blogs.loading);

  // Logs from logsSlice
  const logs = useSelector((state) => state.logs.items) || [];
  const logsStatus = useSelector((state) => state.logs.status);
  const logsError = useSelector((state) => state.logs.error);

  const [userPage, setUserPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const [logPage, setLogPage] = useState(1);

  const itemsPerPage = 10;
  const logsPerPage = 10;

  // Local state to trigger refresh after delete/restore
  const [refreshUsersToggle, setRefreshUsersToggle] = useState(false);

  // Fetch users, posts, and logs once on mount and whenever refreshUsersToggle changes
  useEffect(() => {
    dispatch(fetchUsers({ includeDeleted: true }));
    dispatch(getAllPosts());
    dispatch(fetchLogs());
  }, [dispatch, refreshUsersToggle]);

  // Compute post counts per user
  const postCounts = useMemo(() => {
    const counts = {};
    posts.forEach((post) => {
      if (!post.deleted) {
        const authorId = post.author?._id || post.author;
        if (authorId) counts[authorId] = (counts[authorId] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  const getUserStatus = (user) => {
    if (!user) return 'author';
    if (user.status) return user.status.toLowerCase();
    if (user.isDeleted === true) return 'deleted';
    if (user.deleted === true) return 'deleted';
    if (user.deletedAt) return 'deleted';
    return 'active';
  };

  const validUsers = users.filter(Boolean);

  // Show all users, no filtering
  const filteredUsers = validUsers;

  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastUser = userPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const filteredPosts = posts.filter((post) => !post.deleted);
  const totalPostPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const indexOfLastPost = postPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Logs pagination
  const totalLogPages = Math.ceil(logs.length / logsPerPage);
  const indexOfLastLog = logPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  const handleDeleteUser = (id) => {
    if (currentUser && currentUser._id === id) {
      alert('You cannot delete your own account here.');
      return;
    }
    dispatch(deleteUser(id)).then(() => {
      setRefreshUsersToggle((prev) => !prev);
    });
  };

  const handleRestoreUser = (id) => {
    dispatch(restoreUser(id)).then(() => {
      setRefreshUsersToggle((prev) => !prev);
    });
  };

  const goToNextUserPage = () => {
    if (userPage < totalUserPages) {
      setUserPage((prev) => prev + 1);
    }
  };
  const goToPrevUserPage = () => {
    if (userPage > 1) {
      setUserPage((prev) => prev - 1);
    }
  };
  const goToNextPostPage = () => {
    if (postPage < totalPostPages) {
      setPostPage((prev) => prev + 1);
    }
  };
  const goToPrevPostPage = () => {
    if (postPage > 1) {
      setPostPage((prev) => prev - 1);
    }
  };
  const goToNextLogPage = () => {
    if (logPage < totalLogPages) {
      setLogPage((prev) => prev + 1);
    }
  };
  const goToPrevLogPage = () => {
    if (logPage > 1) {
      setLogPage((prev) => prev - 1);
    }
  };

  if (loadingUsers || loadingPosts) return <p>Loading data...</p>;

  return (
    <div className='min-h-screen bg-background text-text p-10 max-w-7xl mx-auto'>
      <header className='mb-12'>
        <h1 className='text-5xl font-heading font-extrabold text-primary mb-2'>
          User Management
        </h1>
        <p className='text-text max-w-xl'>
          Manage your platform users, see their post counts, and control their
          account status.
        </p>
      </header>

      {/* Users Table */}
      <p className='mb-4'>User List only visible for Admin</p>
      <div className='overflow-x-auto bg-neutral rounded-xl shadow-md border border-primary mb-4'>
        <table className='min-w-full divide-y divide-primary'>
          <thead className='bg-primary/10'>
            <tr>
              <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                Email
              </th>
              <th className='px-6 py-3 text-center text-sm font-semibold text-primary'>
                Posts
              </th>
              <th className='px-6 py-3 text-center text-sm font-semibold text-primary'>
                Status
              </th>
              <th className='px-6 py-3 text-center text-sm font-semibold text-primary'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-primary'>
            {currentUsers.length === 0 && (
              <tr>
                <td colSpan='5' className='text-center py-6 text-secondary'>
                  No users to display.
                </td>
              </tr>
            )}
            {currentUsers.map((user, index) => {
              const userId = user._id || user.id || `author-${index}`;
              const status = getUserStatus(user);
              const isDeleted = status === 'deleted';

              return (
                <tr
                  key={`${userId}-${index}`}
                  className={`hover:bg-primary transition-colors ${
                    isDeleted ? 'bg-accent/10 line-through text-secondary' : ''
                  }`}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {user.username || 'author'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {user.email || 'author'}
                  </td>
                  <td className='px-6 py-4 text-center font-semibold'>
                    {postCounts[userId] || 0}
                  </td>
                  <td className='px-6 py-4 text-center capitalize'>{status}</td>
                  <td className='px-6 py-4 text-center'>
                    {isDeleted ? (
                      <button
                        onClick={() => handleRestoreUser(userId)}
                        className='bg-primary text-text rounded px-4 py-1  hover:scale-95 transition'
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeleteUser(userId)}
                        disabled={currentUser && currentUser._id === userId}
                        className={`bg-accent text-text rounded px-4 py-1  hover:scale-95 transition ${
                          currentUser && currentUser._id === userId
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Users Pagination Buttons */}
      <div className='flex justify-between items-center max-w-sm mx-auto mb-10'>
        <button
          onClick={goToPrevUserPage}
          disabled={userPage === 1}
          className='btn-secondary'
        >
          Previous
        </button>
        <span className='text-secondary font-semibold'>
          Page {userPage} of {totalUserPages}
        </span>
        <button
          onClick={goToNextUserPage}
          disabled={userPage === totalUserPages}
          className='btn-secondary'
        >
          Next
        </button>
      </div>

      {/* Users stats */}
      <section className='mt-12 flex flex-wrap gap-8 justify-center'>
        <div className='bg-white dark:bg-neutral rounded-xl shadow-lg p-8 w-64 text-center'>
          <p className='text-3xl font-heading font-extrabold text-primary'>
            {validUsers.length}
          </p>
          <p className='text-text font-semibold mt-1'>Total Users</p>
        </div>

        <div className='bg-white dark:bg-neutral rounded-xl shadow-lg p-8 w-64 text-center'>
          <p className='text-3xl font-heading font-extrabold text-accent'>
            {validUsers.filter((u) => getUserStatus(u) === 'deleted').length}
          </p>
          <p className='text-text font-semibold mt-1'>Deleted Users</p>
        </div>
      </section>

      {/* Posts Table */}
      <section className='mt-20'>
        <h2 className='text-4xl font-heading font-extrabold text-primary mb-6'>
          Blog Posts
        </h2>

        <p className='mb-4'>Author name only visible for Admin</p>
        <div className='overflow-x-auto bg-neutral rounded-xl shadow-md border border-primary mb-6'>
          <table className='min-w-full divide-y divide-primary'>
            <thead className='bg-primary/10'>
              <tr>
                <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                  Title
                </th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                  Author
                </th>
                <th className='px-6 py-3 text-center text-sm font-semibold text-primary'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-primary'>
              {currentPosts.length === 0 && (
                <tr>
                  <td colSpan='3' className='text-center py-6 text-secondary'>
                    No posts to display.
                  </td>
                </tr>
              )}
              {currentPosts.map((post, idx) => {
                const postId = post._id || post.id || `author-post-${idx}`;
                const authorId = post.author?._id || post.author;
                const authorName =
                  users.find((u) => (u._id || u.id) === authorId)?.username ||
                  'author';

                return (
                  <tr
                    key={postId}
                    className='hover:bg-primary transition-colors'
                  >
                    <td className='px-6 py-4 whitespace-nowrap '>
                      {post.title || 'Untitled'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {authorName}
                    </td>
                    <td className='px-6 py-4 text-center capitalize'>
                      {post.deleted ? 'deleted' : 'active'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className='flex justify-between items-center max-w-sm mx-auto'>
          <button
            onClick={goToPrevPostPage}
            disabled={postPage === 1}
            className='btn-secondary'
          >
            Previous
          </button>
          <span className='text-secondary font-semibold'>
            Page {postPage} of {totalPostPages}
          </span>
          <button
            onClick={goToNextPostPage}
            disabled={postPage === totalPostPages}
            className='btn-secondary'
          >
            Next
          </button>
        </div>
      </section>

      {/* Logs Section */}
      <section className='mt-20'>
        <h2 className='text-4xl font-heading font-extrabold text-primary mb-6'>
          Logs
        </h2>

        {logsStatus === 'loading' && <p>Loading logs...</p>}
        {logsStatus === 'failed' && (
          <p className='text-red-600'>Failed to load logs: {logsError}</p>
        )}

        {logs.length === 0 && logsStatus === 'succeeded' && (
          <p className='text-text'>No logs available.</p>
        )}

        {logs.length > 0 && (
          <div className='overflow-x-auto bg-white dark:bg-neutral rounded-xl shadow-md border border-primary mb-6'>
            <table className='min-w-full divide-y divide-primary'>
              <thead className='bg-primary/10'>
                <tr>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                    Time
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                    Action
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                    User ID
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-primary'>
                {currentLogs.map((log, index) => {
                  // Defensive field access for logs
                  const time = log.createdAt
                    ? new Date(log.createdAt).toLocaleString()
                    : 'author';
                  const action = log.action || 'author';
                  const userId = log.userId || 'author';
                  const details = log.details
                    ? JSON.stringify(log.details)
                    : '';

                  return (
                    <tr
                      className='hover:bg-primary transition-colors'
                      key={`${log._id || index}`}
                    >
                      <td className='px-6 py-4 whitespace-nowrap text-text'>
                        {time}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-text'>
                        {action}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-text'>
                        {userId}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-text'>
                        {details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className='flex justify-between items-center max-w-sm mx-auto'>
          <button
            onClick={goToPrevLogPage}
            disabled={logPage === 1}
            className='btn-secondary'
          >
            Previous
          </button>
          <span className='text-secondary font-semibold'>
            Page {logPage} of {totalLogPages}
          </span>
          <button
            onClick={goToNextLogPage}
            disabled={logPage === totalLogPages}
            className='btn-secondary'
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
