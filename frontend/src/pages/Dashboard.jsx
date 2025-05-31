import { useState } from 'react';

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

const Dashboard = () => {
  const [users, setUsers] = useState(usersMock);

  const deleteUser = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: 'deleted' } : u)));
  };

  const restoreUser = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: 'active' } : u)));
  };

  return (
    <div className='min-h-screen bg-background text-text p-10 max-w-7xl mx-auto'>
      <header className='mb-12'>
        <h1 className='text-5xl font-heading font-extrabold text-primary mb-2'>
          User Management
        </h1>
        <p className='text-secondary max-w-xl'>
          Manage your platform users, see their post counts, and control their
          account status.
        </p>
      </header>

      {/* Users Table */}
      <div className='overflow-x-auto bg-neutral rounded-xl shadow-md border border-primary'>
        <table className='min-w-full divide-y divide-primary'>
          <thead className='bg-primary/10'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-sm font-semibold text-primary'
              >
                Name
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-sm font-semibold text-primary'
              >
                Email
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-center text-sm font-semibold text-primary'
              >
                Posts
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-center text-sm font-semibold text-primary'
              >
                Status
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-center text-sm font-semibold text-primary'
              >
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

      {/* Extra Panel — for example: Total Users + Deleted Users count */}
      <section className='mt-12 flex flex-wrap gap-8 justify-center'>
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
      </section>
    </div>
  );
};

export default Dashboard;
