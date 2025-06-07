// src/components/Dashboard/UsersTable.jsx
import React from 'react';

const UsersTable = ({
  users,
  postCounts,
  getUserStatus,
  currentUser,
  openConfirmModal,
}) => {
  return (
    <>
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
            {users.length === 0 && (
              <tr>
                <td colSpan='5' className='text-center py-6 text-secondary'>
                  No users to display.
                </td>
              </tr>
            )}
            {users.map((user, index) => {
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
                        onClick={() => openConfirmModal(userId, 'restore')}
                        className='bg-primary text-text rounded px-4 py-1 hover:scale-95 transition'
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => openConfirmModal(userId, 'delete')}
                        disabled={currentUser && currentUser._id === userId}
                        className={`bg-accent text-text rounded px-4 py-1 hover:scale-95 transition ${
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
    </>
  );
};

export default UsersTable;
