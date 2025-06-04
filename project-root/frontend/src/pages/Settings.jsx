import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  refreshUser,
  updateUser,
  clearMessage,
  changePassword,
  deleteUser,
} from '../redux/userSlice.js';
import { toast } from 'react-toastify';

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.currentUser);
  const {
    loading: updateLoading,
    error: updateError,
    message: updateMessage,
  } = useSelector((state) => state.user);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [softDeleteUser, setSoftDeleteUser] = useState(null);

  const [form, setForm] = useState({
    username: '',
    email: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setForm({
        username: currentUser.username || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
      dispatch(clearMessage());
    } else if (updateMessage) {
      toast.success(updateMessage);
      dispatch(clearMessage());
    }
  }, [updateError, updateMessage, dispatch]);

  const openEditModal = () => {
    if (currentUser) {
      setForm({
        username: currentUser.username || '',
        email: currentUser.email || '',
      });
    }
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const openDeleteModal = () => {
    if (currentUser && currentUser._id) {
      setSoftDeleteUser(currentUser._id);
    }
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => setShowDeleteModal(false);

  const openPasswordModal = () => {
    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setPasswordError('');
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => setShowPasswordModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateUser({ username: form.username, email: form.email }))
      .unwrap()
      .then(() => {
        setShowEditModal(false);
      })
      .catch(() => {
        // error handled by Redux state
      });
  };

  const handleSoftDelete = () => {
    if (!softDeleteUser) return;

    dispatch(deleteUser(softDeleteUser))
      .unwrap()
      .then(() => {
        toast.success('Account deactivated successfully!');
        setSoftDeleteUser(null);
        setShowDeleteModal(false);

        // Navigate to home page after deletion
        navigate('/');
      })
      .catch(() => {
        toast.error('Failed to deactivate account.');
        setSoftDeleteUser(null);
        setShowDeleteModal(false);
      });
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    setPasswordLoading(true);
    try {
      await dispatch(
        changePassword({
          currentPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        })
      ).unwrap();

      // toast.success('Password changed successfully!');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      closePasswordModal();
    } catch (err) {
      toast.error(err || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto px-6 py-12 bg-white dark:bg-neutral rounded-lg shadow-md space-y-12'>
      <h1 className='text-primary text-3xl font-heading font-bold mb-8'>
        Settings
      </h1>

      {/* Profile Section */}
      <section>
        <h2 className='text-primary text-2xl font-semibold mb-4'>
          Profile Information
        </h2>
        <div
          className='bg-background dark:bg-neutral p-6 rounded-md shadow cursor-pointer hover:shadow-lg transition'
          onClick={openEditModal}
          title='Click to edit profile'
        >
          <p>
            <strong>Name:</strong> {currentUser?.username || 'Loading...'}
          </p>
          <p>
            <strong>Email:</strong> {currentUser?.email || 'Loading...'}
          </p>
          <p className='mt-2 text-sm text-secondary'>
            Click here to update your profile
          </p>
        </div>
      </section>

      {/* Change Password Section */}
      <section>
        <h2 className='text-primary text-2xl font-semibold mb-4'>Security</h2>
        <div className='bg-background dark:bg-neutral p-6 rounded-md shadow cursor-pointer hover:shadow-lg transition'>
          <button
            onClick={openPasswordModal}
            className='bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-accent transition'
          >
            Change Password
          </button>
        </div>
      </section>

      {/* Soft Delete Section */}
      <section>
        <h2 className='text-2xl font-semibold mb-4 text-accent'>Danger Zone</h2>
        <div className='bg-background dark:bg-neutral p-6 rounded-md shadow cursor-pointer hover:shadow-lg transition'>
          <p className='mb-4 text-secondary'>
            You can deactivate your account. This is a soft delete — your data
            will be retained but your account will be inactive.
          </p>
          <button
            onClick={openDeleteModal}
            className='bg-accent text-white px-5 py-2 rounded-full font-semibold hover:bg-red-700 transition'
          >
            Deactivate Account
          </button>
        </div>
      </section>

      {/* Edit Modal */}
      {showEditModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-neutral rounded-lg max-w-md w-full p-6 relative'>
            <h3 className='text-xl font-semibold mb-4'>Edit Profile</h3>
            <form onSubmit={handleUpdate} className='space-y-4'>
              <div>
                <label htmlFor='username' className='block font-medium mb-1'>
                  Name
                </label>
                <input
                  id='username'
                  name='username'
                  value={form.username}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className='w-full border border-secondary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
                  required
                />
              </div>

              <div className='flex justify-end space-x-4 mt-6'>
                <button
                  type='button'
                  onClick={closeEditModal}
                  className='px-4 py-2 rounded-md border border-secondary hover:bg-neutral transition'
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={updateLoading}
                  className={`px-5 py-2 rounded-full bg-primary text-white font-semibold hover:bg-accent transition ${
                    updateLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-neutral rounded-lg max-w-md w-full p-6 relative'>
            <h3 className='text-xl font-semibold mb-4'>Change Password</h3>
            <form onSubmit={handlePasswordChangeSubmit} className='space-y-4'>
              <input
                type='password'
                name='oldPassword'
                placeholder='Current Password'
                value={passwordForm.oldPassword}
                onChange={handlePasswordChangeInput}
                required
                className='w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              />
              <input
                type='password'
                name='newPassword'
                placeholder='New Password'
                value={passwordForm.newPassword}
                onChange={handlePasswordChangeInput}
                required
                className='w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              />
              <input
                type='password'
                name='confirmNewPassword'
                placeholder='Confirm New Password'
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChangeInput}
                required
                className='w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              />

              {passwordError && <p className='text-red-600'>{passwordError}</p>}

              <div className='flex justify-end space-x-4 mt-6'>
                <button
                  type='button'
                  onClick={closePasswordModal}
                  className='px-4 py-2 rounded-md border border-secondary hover:bg-neutral transition'
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-5 py-2 rounded-full bg-primary text-white font-semibold hover:bg-accent transition'
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-neutral rounded-lg max-w-md w-full p-6 relative'>
            <h3 className='text-xl font-semibold mb-4 text-red-600'>
              Deactivate Account
            </h3>
            <p className='mb-6'>
              Are you sure you want to deactivate your account? This will make
              your profile inactive but will not delete your data.
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={closeDeleteModal}
                className='px-4 py-2 rounded-md border border-secondary hover:bg-neutral transition'
              >
                Cancel
              </button>
              <button
                onClick={handleSoftDelete}
                className='px-5 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition'
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
