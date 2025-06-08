import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts, deletePost, updatePost } from '../redux/blogSlice.js';
import { sendThankYouEmail } from '../redux/subscriptionSlice.js';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BlogCard from '../components/BlogCard.jsx';

const Blogs = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.blogs);
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
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
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
          updatedData: { title: editedTitle, body: editedBody },
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
                  <BlogCard
                    key={post._id}
                    post={post}
                    index={index}
                    isExpanded={isExpanded}
                    toggleExpand={toggleExpand}
                    isOwner={isOwner}
                    isAdmin={isAdmin}
                    handleEdit={handleEdit}
                    confirmDelete={confirmDelete}
                    postRef={(el) => (postRefs.current[post._id] = el)}
                  />
                );
              })
          )}
        </div>

        {/* Sidebar and modal sections can go here */}
      </div>

      {/* Your modal for editing posts and subscription form would be here */}
    </div>
  );
};

export default Blogs;
