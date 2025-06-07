import React from 'react';

const DeleteModal = ({ onClose, onDelete }) => (
  <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
    <div className='bg-white dark:bg-neutral rounded-lg max-w-md w-full p-6 relative'>
      <h3 className='text-xl font-semibold mb-4 text-red-600'>
        Deactivate Account
      </h3>
      <p className='mb-6'>
        Are you sure you want to deactivate your account? This will make your
        profile inactive but will not delete your data.
      </p>
      <div className='flex justify-end space-x-4'>
        <button
          onClick={onClose}
          className='px-4 py-2 rounded-md border border-secondary hover:bg-neutral transition'
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className='px-5 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition'
        >
          Deactivate
        </button>
      </div>
    </div>
  </div>
);

export default DeleteModal;
