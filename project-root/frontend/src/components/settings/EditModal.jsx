import React from 'react';

const EditModal = ({ form, onChange, onClose, onSubmit, loading }) => (
  <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
    <div className='bg-white dark:bg-neutral rounded-lg max-w-md w-full p-6 relative'>
      <h3 className='text-xl font-semibold mb-4'>Edit Profile</h3>
      <form onSubmit={onSubmit} className='space-y-4'>
        <div>
          <label htmlFor='username' className='block font-medium mb-1'>
            Name
          </label>
          <input
            id='username'
            name='username'
            value={form.username}
            onChange={onChange}
            className='w-full border border-secondary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
            required
          />
        </div>
        <div>
          <label htmlFor='email' className='block font-medium mb-1'>
            Email
          </label>
          <input
            id='email'
            name='email'
            type='email'
            value={form.email}
            onChange={onChange}
            className='w-full border border-secondary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
            required
          />
        </div>
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
            disabled={loading}
            className={`px-5 py-2 rounded-full bg-primary text-white font-semibold hover:bg-accent transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default EditModal;
