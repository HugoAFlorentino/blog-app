import { useState, useMemo } from 'react';

// Mock Data
const usersMock = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    posts: 15,
    status: 'active',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    posts: 7,
    status: 'deleted',
  },
  {
    id: 3,
    name: 'Clara Lee',
    email: 'clara@example.com',
    posts: 23,
    status: 'active',
  },
];

const postsMock = [
  {
    id: 101,
    title: 'React Hooks Guide',
    author: 'Alice Johnson',
    status: 'active',
    createdAt: '2025-05-20',
  },
  {
    id: 102,
    title: 'MongoDB Basics',
    author: 'Bob Smith',
    status: 'deleted',
    createdAt: '2025-04-15',
  },
  {
    id: 103,
    title: 'Express Middleware',
    author: 'Clara Lee',
    status: 'active',
    createdAt: '2025-05-10',
  },
];

const logsMock = [
  {
    id: 201,
    user: 'Alice Johnson',
    action: 'login',
    date: '2025-06-01T17:46:38Z',
    ip: '::1',
  },
  {
    id: 202,
    user: 'Bob Smith',
    action: 'create_post',
    date: '2025-05-25T12:30:00Z',
    ip: '192.168.0.1',
  },
  {
    id: 203,
    user: 'Clara Lee',
    action: 'delete_post',
    date: '2025-05-28T09:15:45Z',
    ip: '10.0.0.5',
  },
];

const Dashboard = () => {
  const [users, setUsers] = useState(usersMock);
  const [posts, setPosts] = useState(postsMock);
  const [logs, setLogs] = useState(logsMock);

  // Users handlers
  const deleteUser = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: 'deleted' } : u)));
  };
  const restoreUser = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: 'active' } : u)));
  };

  // Posts handlers
  const deletePost = (id) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, status: 'deleted' } : p)));
  };
  const restorePost = (id) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, status: 'active' } : p)));
  };

  // Filters & Sorting state for Logs
  const [logFilter, setLogFilter] = useState({
    user: '',
    action: '',
    dateFrom: '',
    dateTo: '',
  });
  const [logSort, setLogSort] = useState({ field: 'date', direction: 'desc' });

  // Filter & sort logs
  const filteredSortedLogs = useMemo(() => {
    return logs
      .filter((log) => {
        if (
          logFilter.user &&
          !log.user.toLowerCase().includes(logFilter.user.toLowerCase())
        )
          return false;
        if (logFilter.action && log.action !== logFilter.action) return false;
        if (
          logFilter.dateFrom &&
          new Date(log.date) < new Date(logFilter.dateFrom)
        )
          return false;
        if (logFilter.dateTo && new Date(log.date) > new Date(logFilter.dateTo))
          return false;
        return true;
      })
      .sort((a, b) => {
        if (logSort.field === 'date') {
          const diff = new Date(a.date) - new Date(b.date);
          return logSort.direction === 'asc' ? diff : -diff;
        }
        if (logSort.field === 'user') {
          const comp = a.user.localeCompare(b.user);
          return logSort.direction === 'asc' ? comp : -comp;
        }
        return 0;
      });
  }, [logs, logFilter, logSort]);

  return (
    <div className='min-h-screen bg-background text-text p-10 max-w-7xl mx-auto space-y-12'>
      {/* User Management Section */}
      <section>
        <h2 className='text-4xl font-heading font-extrabold text-primary mb-4'>
          User Management
        </h2>
        {/* Users Table */}
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
            <tbody className='divide-y divide-primary/30'>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`${
                    user.status === 'deleted'
                      ? 'bg-accent/10 line-through text-secondary'
                      : ''
                  } hover:bg-primary/10 transition-colors cursor-pointer`}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>{user.name}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>{user.email}</td>
                  <td className='px-6 py-4 text-center font-semibold'>
                    {user.posts}
                  </td>
                  <td className='px-6 py-4 text-center capitalize'>
                    {user.status}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    {user.status === 'active' ? (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className='bg-accent text-neutral rounded px-4 py-1 font-semibold hover:bg-accent/90 transition'
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        onClick={() => restoreUser(user.id)}
                        className='bg-primary text-neutral rounded px-4 py-1 font-semibold hover:bg-primary/90 transition'
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Stats */}
        <div className='flex flex-wrap gap-8 justify-center'>
          <div className='bg-primary/10 rounded-xl shadow-lg p-8 w-64 text-center'>
            <p className='text-3xl font-heading font-extrabold text-primary'>
              {users.length}
            </p>
            <p className='text-secondary font-semibold mt-1'>Total Users</p>
          </div>
          <div className='bg-accent/10 rounded-xl shadow-lg p-8 w-64 text-center'>
            <p className='text-3xl font-heading font-extrabold text-accent'>
              {users.filter((u) => u.status === 'deleted').length}
            </p>
            <p className='text-secondary font-semibold mt-1'>Deleted Users</p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section>
        <h2 className='text-4xl font-heading font-extrabold text-primary mb-4'>
          Blog Posts
        </h2>
        <div className='overflow-x-auto bg-neutral rounded-xl shadow-md border border-primary mb-4'>
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
                <th className='px-6 py-3 text-center text-sm font-semibold text-primary'>
                  Created At
                </th>
                <th className='px-6 py-3 text-center text-sm font-semibold text-primary'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-primary/30'>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className={`${
                    post.status === 'deleted'
                      ? 'bg-accent/10 line-through text-secondary'
                      : ''
                  } hover:bg-primary/10 transition-colors cursor-pointer`}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>{post.title}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>{post.author}</td>
                  <td className='px-6 py-4 text-center capitalize'>
                    {post.status}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    {post.status === 'active' ? (
                      <button
                        onClick={() => deletePost(post.id)}
                        className='bg-accent text-neutral rounded px-4 py-1 font-semibold hover:bg-accent/90 transition'
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        onClick={() => restorePost(post.id)}
                        className='bg-primary text-neutral rounded px-4 py-1 font-semibold hover:bg-primary/90 transition'
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Posts Stats */}
        <div className='flex flex-wrap gap-8 justify-center'>
          <div className='bg-primary/10 rounded-xl shadow-lg p-8 w-64 text-center'>
            <p className='text-3xl font-heading font-extrabold text-primary'>
              {posts.length}
            </p>
            <p className='text-secondary font-semibold mt-1'>Total Posts</p>
          </div>
          <div className='bg-accent/10 rounded-xl shadow-lg p-8 w-64 text-center'>
            <p className='text-3xl font-heading font-extrabold text-accent'>
              {posts.filter((p) => p.status === 'deleted').length}
            </p>
            <p className='text-secondary font-semibold mt-1'>Deleted Posts</p>
          </div>
        </div>
      </section>

      {/* Logs Section */}
      <section>
        <h2 className='text-4xl font-heading font-extrabold text-primary mb-4'>
          Activity Logs
        </h2>

        {/* Filters */}
        <div className='flex flex-wrap gap-4 mb-6'>
          <input
            type='text'
            placeholder='Filter by user'
            className='p-2 border rounded w-48'
            value={logFilter.user}
            onChange={(e) =>
              setLogFilter({ ...logFilter, user: e.target.value })
            }
          />
          <select
            className='p-2 border rounded'
            value={logFilter.action}
            onChange={(e) =>
              setLogFilter({ ...logFilter, action: e.target.value })
            }
          >
            <option value=''>All Actions</option>
            <option value='login'>Login</option>
            <option value='create_post'>Create Post</option>
            <option value='delete_post'>Delete Post</option>
            {/* Add more action types as needed */}
          </select>
          <input
            type='date'
            className='p-2 border rounded'
            value={logFilter.dateFrom}
            onChange={(e) =>
              setLogFilter({ ...logFilter, dateFrom: e.target.value })
            }
            placeholder='From'
          />
          <input
            type='date'
            className='p-2 border rounded'
            value={logFilter.dateTo}
            onChange={(e) =>
              setLogFilter({ ...logFilter, dateTo: e.target.value })
            }
            placeholder='To'
          />
          <button
            className='bg-primary text-white px-4 py-2 rounded'
            onClick={() =>
              setLogFilter({ user: '', action: '', dateFrom: '', dateTo: '' })
            }
          >
            Clear Filters
          </button>
        </div>

        {/* Logs Table */}
        <div className='overflow-x-auto bg-neutral rounded-xl shadow-md border border-primary'>
          <table className='min-w-full divide-y divide-primary'>
            <thead className='bg-primary/10 cursor-pointer'>
              <tr>
                <th
                  className='px-6 py-3 text-left text-sm font-semibold text-primary'
                  onClick={() =>
                    setLogSort({
                      field: 'user',
                      direction:
                        logSort.direction === 'asc' && logSort.field === 'user'
                          ? 'desc'
                          : 'asc',
                    })
                  }
                >
                  User{' '}
                  {logSort.field === 'user'
                    ? logSort.direction === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                  Action
                </th>
                <th
                  className='px-6 py-3 text-left text-sm font-semibold text-primary'
                  onClick={() =>
                    setLogSort({
                      field: 'date',
                      direction:
                        logSort.direction === 'asc' && logSort.field === 'date'
                          ? 'desc'
                          : 'asc',
                    })
                  }
                >
                  Date{' '}
                  {logSort.field === 'date'
                    ? logSort.direction === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                  IP
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-primary/30'>
              {filteredSortedLogs.map((log) => (
                <tr
                  key={log.id}
                  className='hover:bg-primary/10 transition-colors cursor-pointer'
                >
                  <td className='px-6 py-4 whitespace-nowrap'>{log.user}</td>
                  <td className='px-6 py-4 whitespace-nowrap capitalize'>
                    {log.action.replace('_', ' ')}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {new Date(log.date).toLocaleString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
