import React from 'react';

const PasswordModal = ({
  passwordForm,
  onChange,
  onClose,
  onSubmit,
  loading,
  error,
}) => (
  <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
    <div className='bg-white dark:bg-neutral rounded-lg max-w-md w-full p-6 relative'>
      <h3 className='text-xl font-semibold mb-4'>Change Password</h3>
      <form onSubmit={onSubmit} className='space-y-4'>
        <input
          type='password'
          name='oldPassword'
          placeholder='Current Password'
          value={passwordForm.oldPassword}
          onChange={onChange}
          required
          className='w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
        />
        <input
          type='password'
          name='newPassword'
          placeholder='New Password'
          value={passwordForm.newPassword}
          onChange={onChange}
          required
          className='w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
        />
        <input
          type='password'
          name='confirmNewPassword'
          placeholder='Confirm New Password'
          value={passwordForm.confirmNewPassword}
          onChange={onChange}
          required
          className='w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
        />
        {error && <p className='text-red-600'>{error}</p>}
        <div className='flex justify-end space-x-4 mt-6'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-md border border-secondary hover:bg-neutral transition'
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-5 py-2 rounded-full bg-primary text-white font-semibold hover:bg-accent transition'
            disabled={loading}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default PasswordModal;
