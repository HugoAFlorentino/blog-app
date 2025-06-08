import React, { useEffect, useState, useCallback } from 'react';
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
import { EditModal, PasswordModal, DeleteModal } from '../components/index.js';

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

  const [form, setForm] = useState({ username: '', email: '' });
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

  const openEditModal = useCallback(() => {
    if (currentUser) {
      setForm({
        username: currentUser.username || '',
        email: currentUser.email || '',
      });
    }
    setShowEditModal(true);
  }, [currentUser]);

  const closeEditModal = useCallback(() => setShowEditModal(false), []);

  const openDeleteModal = useCallback(() => {
    if (currentUser && currentUser._id) {
      setSoftDeleteUser(currentUser._id);
    }
    setShowDeleteModal(true);
  }, [currentUser]);

  const closeDeleteModal = useCallback(() => setShowDeleteModal(false), []);

  const openPasswordModal = useCallback(() => {
    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setPasswordError('');
    setShowPasswordModal(true);
  }, []);

  const closePasswordModal = useCallback(() => setShowPasswordModal(false), []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleUpdate = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(updateUser({ username: form.username, email: form.email }))
        .unwrap()
        .then(() => {
          setShowEditModal(false);
        })
        .catch(() => {});
    },
    [dispatch, form.username, form.email]
  );

  const handleSoftDelete = useCallback(() => {
    if (!softDeleteUser) return;

    dispatch(deleteUser(softDeleteUser))
      .unwrap()
      .then(() => {
        toast.success('Account deactivated successfully!');
        setSoftDeleteUser(null);
        setShowDeleteModal(false);
        navigate('/');
      })
      .catch(() => {
        toast.error('Failed to deactivate account.');
        setSoftDeleteUser(null);
        setShowDeleteModal(false);
      });
  }, [dispatch, navigate, softDeleteUser]);

  const handlePasswordChangeInput = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError('');
  }, []);

  const handlePasswordChangeSubmit = useCallback(
    async (e) => {
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

        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        closePasswordModal();
        toast.success('Password changed successfully!');
      } catch (err) {
        toast.error(err || 'Failed to change password.');
      } finally {
        setPasswordLoading(false);
      }
    },
    [dispatch, passwordForm, closePasswordModal]
  );

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

      {/* Modals */}
      {showEditModal && (
        <EditModal
          form={form}
          onChange={handleChange}
          onClose={closeEditModal}
          onSubmit={handleUpdate}
          loading={updateLoading}
        />
      )}

      {showPasswordModal && (
        <PasswordModal
          passwordForm={passwordForm}
          onChange={handlePasswordChangeInput}
          onClose={closePasswordModal}
          onSubmit={handlePasswordChangeSubmit}
          loading={passwordLoading}
          error={passwordError}
        />
      )}

      {showDeleteModal && (
        <DeleteModal onClose={closeDeleteModal} onDelete={handleSoftDelete} />
      )}
    </div>
  );
};

export default Settings;
