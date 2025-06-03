import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts, deletePost, updatePost } from '../redux/blogSlice';
import { sendThankYouEmail } from '../redux/subscriptionSlice';
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
                    className='bg-white dark:bg-neutral p-6 rounded-lg shadow cursor-pointer'
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

                    <button
                      onClick={() => toggleExpand(post._id)}
                      className='text-primary font-medium hover:underline mr-4'
                    >
                      {isExpanded ? 'Show Less ←' : 'Read More →'}
                    </button>

                    {(isOwner || isAdmin) && (
                      <>
                        <button
                          onClick={() => handleEdit(post)}
                          className='mr-4 px-3 py-1 rounded-md bg-primary text-text font-semibold shadow-sm hover:scale-95 transition duration-150'
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => confirmDelete(post._id)}
                          className='px-3 py-1 rounded-md bg-accent text-text font-semibold shadow-sm hover:scale-95 transition duration-150'
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </motion.div>
                );
              })
          )}
        </div>

        {/* Sidebar */}
        <aside className='space-y-6'>
          <div className='bg-white dark:bg-neutral p-6 rounded-lg shadow-lg'>
            <h4 className='text-xl font-heading font-semibold mb-2'>
              Subscribe to our Newsletter
            </h4>
            <p className='text-sm text-secondary mb-3'>
              Get the latest posts delivered straight to your inbox.
            </p>
            <input
              type='email'
              value={subscriberEmail}
              onChange={(e) => setSubscriberEmail(e.target.value)}
              placeholder='you@example.com'
              className='bg-white dark:bg-neutral w-full px-4 py-2 rounded mb-3 border border-secondary focus:outline-none text-black'
            />
            <button
              onClick={handleSubscription}
              disabled={emailStatus === 'loading'}
              className={`w-full bg-primary text-text px-4 py-2 rounded-md font-semibold shadow-sm transition duration-300 ${
                emailStatus === 'loading'
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:scale-95'
              }`}
            >
              {emailStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          {/* Ads */}
          <div className='bg-white dark:bg-neutral p-6 rounded-lg shadow-lg text-center'>
            <p className='text-secondary text-sm mb-2'>Advertisement</p>
            <h4 className='text-lg font-semibold mb-1'>
              The Future of AI in Marketing
            </h4>
            <p className='text-sm text-secondary mb-2'>
              Discover how companies are using artificial intelligence to
              revolutionize customer engagement and targeting.
            </p>
            <p className='text-xs text-gray-500'>Sponsored by AdnovaTech</p>
          </div>

          <div className='bg-white dark:bg-neutral p-4 rounded-lg shadow-lg text-center'>
            <p className='text-secondary text-sm mb-2'>Sponsored</p>
            <h4 className='text-base font-semibold mb-1'>
              Master UI Design in 30 Days
            </h4>
            <p className='text-sm text-secondary mb-1'>
              Learn UI/UX design from scratch with interactive challenges and
              feedback.
            </p>
            <p className='text-xs text-gray-500'>From: PixelPlay Academy</p>
          </div>

          <div className='bg-white dark:bg-neutral p-4 rounded-lg shadow-lg text-center'>
            <p className='text-secondary text-sm mb-2'>Partner Message</p>
            <h4 className='text-lg font-semibold mb-1'>
              Remote Jobs That Pay $100k+
            </h4>
            <p className='text-sm text-secondary mb-2'>
              A weekly roundup of top-paying remote jobs in tech, design, and
              marketing.
            </p>
            <p className='text-xs text-gray-500'>JobHive.io</p>
          </div>

          <div className='bg-white dark:bg-neutral p-4 rounded-lg shadow-lg text-left'>
            <p className='text-secondary text-sm mb-2'>Featured Ad</p>
            <h4 className='text-lg font-semibold mb-1'>
              How to Optimize Your Website for Performance in 2025
            </h4>
            <p className='text-sm text-secondary mb-2'>
              Speed is critical for user experience and SEO. This post covers
              best practices, tools, and tips to optimize your website
              performance, including lazy loading, caching strategies, and
              minimizing JavaScript payloads.
            </p>
            <p className='text-xs text-gray-500'>Author: Hugo</p>
          </div>

          <div className='bg-white dark:bg-neutral p-4 rounded-lg shadow-lg text-center'>
            <p className='text-secondary text-sm mb-2'>Ad Space</p>
            <h4 className='text-base font-semibold mb-1'>
              Try Lume — Your AI Writing Assistant
            </h4>
            <p className='text-sm text-secondary mb-2'>
              Instantly generate better emails, blog posts, and reports with
              Lume AI.
            </p>
            <p className='text-xs text-gray-500'>Trusted by 1M+ writers</p>
          </div>
        </aside>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-neutral p-6 rounded-lg w-full max-w-md shadow-lg'>
            <h2 className='text-xl font-semibold mb-4'>Edit Post</h2>

            <label className='block mb-2 text-sm font-medium text-primary'>
              Title
            </label>
            <input
              type='text'
              className='w-full p-2 border rounded mb-4 text-black'
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />

            <label className='block mb-2 text-sm font-medium text-primary'>
              Body
            </label>
            <textarea
              className='w-full p-2 border rounded mb-4 h-32 text-black'
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
            />

            <div className='flex justify-end space-x-4'>
              <button
                className='bg-gray-300 text-text px-4 py-2 rounded hover:bg-gray-400'
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className='bg-primary text-text px-4 py-2 rounded hover:bg-orange-400'
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletePostId && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-neutral p-6 rounded-lg w-full max-w-sm shadow-lg text-center'>
            <h3 className='text-lg font-semibold mb-4'>
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center space-x-6'>
              <button
                onClick={cancelDelete}
                className='px-4 py-2 rounded bg-gray-300 hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
