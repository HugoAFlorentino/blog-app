import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchUsers, deleteUser, restoreUser } from '../redux/userSlice.js';
import { getAllPosts } from '../redux/blogSlice.js';
import { fetchLogs } from '../redux/logsSlice.js';

import {
  UsersTable,
  PostsTable,
  LogsTable,
  ConfirmModal,
} from '../components/index.js';

const Dashboard = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const users = useSelector((state) => state.user.users) || [];
  const loadingUsers = useSelector((state) => state.user.loading);
  const posts = useSelector((state) => state.blogs.posts) || [];
  const loadingPosts = useSelector((state) => state.blogs.loading);
  const logs = useSelector((state) => state.logs.items) || [];
  const logsStatus = useSelector((state) => state.logs.status);
  const logsError = useSelector((state) => state.logs.error);

  const [userPage, setUserPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const [logPage, setLogPage] = useState(1);

  const itemsPerPage = 10;
  const logsPerPage = 10;

  const [refreshUsersToggle, setRefreshUsersToggle] = useState(false);

  // For modal control
  const [modalData, setModalData] = useState({
    open: false,
    userId: null,
    action: null,
  });

  useEffect(() => {
    dispatch(fetchUsers({ includeDeleted: true }));
    dispatch(getAllPosts());
    dispatch(fetchLogs());
  }, [dispatch, refreshUsersToggle]);

  // Count posts per user (excluding deleted posts)
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

  const totalLogPages = Math.ceil(logs.length / logsPerPage);
  const indexOfLastLog = logPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  // Handlers for delete and restore with modal confirmation
  const openConfirmModal = (userId, action) => {
    if (action === 'delete' && currentUser && currentUser._id === userId) {
      alert('You cannot delete your own account here.');
      return;
    }
    setModalData({ open: true, userId, action });
  };

  const closeModal = () => {
    setModalData({ open: false, userId: null, action: null });
  };

  const confirmAction = () => {
    const { userId, action } = modalData;
    if (action === 'delete') {
      dispatch(deleteUser(userId)).then(() => {
        setRefreshUsersToggle((prev) => !prev);
        closeModal();
      });
    } else if (action === 'restore') {
      dispatch(restoreUser(userId)).then(() => {
        setRefreshUsersToggle((prev) => !prev);
        closeModal();
      });
    }
  };

  if (loadingUsers || loadingPosts)
    return (
      <p className='flex justify-center items-center min-h-screen'>
        Loading data...
      </p>
    );

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

      <UsersTable
        users={currentUsers}
        postCounts={postCounts}
        getUserStatus={getUserStatus}
        currentUser={currentUser}
        openConfirmModal={openConfirmModal}
      />
      <PaginationControls
        currentPage={userPage}
        totalPages={totalUserPages}
        onPrev={() => setUserPage((p) => Math.max(p - 1, 1))}
        onNext={() => setUserPage((p) => Math.min(p + 1, totalUserPages))}
      />

      <section className='mt-12 flex flex-wrap gap-8 justify-center'>
        <StatsCard label='Total Users' value={validUsers.length} />
        <StatsCard
          label='Deleted Users'
          value={
            validUsers.filter((u) => getUserStatus(u) === 'deleted').length
          }
          accent
        />
      </section>

      <PostsTable
        posts={currentPosts}
        users={users}
        currentPage={postPage}
        totalPages={totalPostPages}
        onPrev={() => setPostPage((p) => Math.max(p - 1, 1))}
        onNext={() => setPostPage((p) => Math.min(p + 1, totalPostPages))}
      />

      <LogsTable
        logs={currentLogs}
        logsStatus={logsStatus}
        logsError={logsError}
        currentPage={logPage}
        totalPages={totalLogPages}
        onPrev={() => setLogPage((p) => Math.max(p - 1, 1))}
        onNext={() => setLogPage((p) => Math.min(p + 1, totalLogPages))}
      />

      <ConfirmModal
        isOpen={modalData.open}
        action={modalData.action}
        onCancel={closeModal}
        onConfirm={confirmAction}
      />
    </div>
  );
};

// Pagination controls
const PaginationControls = ({ currentPage, totalPages, onPrev, onNext }) => (
  <div className='flex justify-between items-center max-w-sm mx-auto mb-10'>
    <button
      onClick={onPrev}
      disabled={currentPage === 1}
      className='btn-secondary'
    >
      Previous
    </button>
    <span className='text-secondary font-semibold'>
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={onNext}
      disabled={currentPage === totalPages}
      className='btn-secondary'
    >
      Next
    </button>
  </div>
);

// Stats card
const StatsCard = ({ label, value, accent = false }) => (
  <div
    className={`bg-white dark:bg-neutral rounded-xl shadow-lg p-8 w-64 text-center ${
      accent ? 'text-accent' : 'text-primary'
    }`}
  >
    <p className='text-3xl font-heading font-extrabold'>{value}</p>
    <p className='text-text font-semibold mt-1'>{label}</p>
  </div>
);

export default Dashboard;
