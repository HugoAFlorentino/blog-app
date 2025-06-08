import React from 'react';

const ConfirmModal = ({ isOpen, action, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  const actionText = action === 'delete' ? 'Delete' : 'Restore';

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50'>
      <div className='bg-white dark:bg-neutral rounded-lg p-6 max-w-sm w-full shadow-lg'>
        <h2 className='text-xl font-semibold mb-4'>
          Confirm {actionText} User
        </h2>
        <p className='mb-6'>
          Are you sure you want to <strong>{actionText.toLowerCase()}</strong>{' '}
          this user?
        </p>
        <div className='flex justify-end gap-4'>
          <button
            onClick={onCancel}
            className='btn-secondary px-4 py-2 rounded hover:bg-gray-200'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white ${
              action === 'delete'
                ? 'bg-accent hover:bg-accent-dark'
                : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
