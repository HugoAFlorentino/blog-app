import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts, deletePost, updatePost } from '../redux/blogSlice.js';
import { sendThankYouEmail } from '../redux/subscriptionSlice.js';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const postVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 110,
      damping: 15,
      mass: 0.5,
    },
  },
  hover: {
    scale: 1.03,
    y: -5,
    boxShadow: '0px 10px 20px rgba(0,0,0,0.12)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

const READ_MORE_THRESHOLD = 200;

const Blogs = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.blogs);
  const { status: emailStatus } = useSelector((state) => state.subscription);
  const currentUser = useSelector((state) => state.user?.currentUser);
  const { id } = useParams();

  const [expandedPosts, setExpandedPosts] = useState({});
  const postRefs = useRef({});

  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [deletePostId, setDeletePostId] = useState(null);
  const [subscriberEmail, setSubscriberEmail] = useState('');

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    if (id && postRefs.current[id]) {
      postRefs.current[id].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setExpandedPosts((prev) => ({ ...prev, [id]: true }));
    }
  }, [id, posts]);

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const confirmDelete = (postId) => {
    setDeletePostId(postId);
  };

  const cancelDelete = () => {
    setDeletePostId(null);
  };

  const handleDelete = () => {
    if (!deletePostId) return;

    dispatch(deletePost(deletePostId))
      .unwrap()
      .then(() => {
        toast.success('Post deleted successfully!');
        setDeletePostId(null);
        dispatch(getAllPosts());
      })
      .catch(() => {
        toast.error('Failed to delete post.');
        setDeletePostId(null);
      });
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditedTitle(post.title);
    setEditedBody(post.body);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingPost && editedTitle.trim()) {
      dispatch(
        updatePost({
          id: editingPost._id,
          updatedData: {
            title: editedTitle,
            body: editedBody,
          },
        })
      )
        .unwrap()
        .then(() => {
          toast.success('Post updated successfully!');
          setShowModal(false);
          setEditingPost(null);
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          });
          dispatch(getAllPosts());
        })
        .catch(() => {
          toast.error('Failed to update post.');
        });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingPost(null);
  };

  const handleSubscription = () => {
    if (!subscriberEmail.trim()) {
      toast.error('Please enter a valid email.');
      return;
    }

    dispatch(sendThankYouEmail(subscriberEmail))
      .unwrap()
      .then(() => {
        toast.success('Thanks for subscribing!');
        setSubscriberEmail('');
      })
      .catch((err) => {
        toast.error(`Subscription failed: ${err?.message || 'Unknown error'}`);
      });
  };

  return (
    <div className='px-4 md:px-12 max-w-7xl mx-auto py-12'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-10'>
        <div className='lg:col-span-3 space-y-8'>
          <h2 className='text-3xl font-heading font-bold mb-6'>
            All Blog Posts
          </h2>

          {loading ? (
            <p className='flex justify-center items-center min-h-screen'>
              Loading...
            </p>
          ) : error ? (
            <p className='text-accent'>{error}</p>
          ) : (
            posts
              .filter((post) => !post.isDeleted)
              .map((post, index) => {
                const isExpanded = expandedPosts[post._id];
                const isOwner =
                  currentUser &&
                  (post.author?._id === currentUser._id ||
                    post.author === currentUser._id);
                const isAdmin = currentUser && currentUser.role === 'admin';

                return (
                  <motion.div
                    key={post._id}
                    ref={(el) => (postRefs.current[post._id] = el)}
                    id={post._id}
                    className='bg-white dark:bg-neutral p-6 rounded-lg shadow'
                    variants={postVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    whileHover='hover'
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className='text-2xl font-heading font-semibold mb-2'>
                      {post.title}
                    </h3>

                    <p
                      className={`text-secondary mb-3 ${
                        !isExpanded ? 'line-clamp-3' : ''
                      }`}
                    >
                      {post.body}
                    </p>

                    <p className='text-sm text-gray-500 mb-2'>
                      Author:{' '}
                      <span className='font-medium'>
                        {post.author?.username || 'Unknown'}
                      </span>
                    </p>

                    {post.body.length > READ_MORE_THRESHOLD && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(post._id);
                        }}
                        className='bg-primary text-text px-4 py-2 rounded-md font-semibold shadow-sm hover:scale-95 duration-300 transition'
                      >
                        {isExpanded ? 'Show Less ←' : 'Read More →'}
                      </button>
                    )}

                    {(isOwner || isAdmin) && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className='flex space-x-4 mt-4'
                      >
                        <button
                          onClick={() => handleEdit(post)}
                          className='px-3 py-1 rounded-md bg-primary text-text font-semibold shadow-sm hover:scale-95 transition duration-150'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(post._id)}
                          className='px-3 py-1 rounded-md bg-accent text-text font-semibold shadow-sm hover:scale-95 transition duration-150'
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })
          )}
        </div>

        {/* Sidebar and modal section (if any) */}
      </div>
    </div>
  );
};

export default Blogs;
