import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { deletePost, updatePost } from '../../redux/blogSlice.js';
import { toast } from 'react-toastify';

const postVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 110, damping: 15, mass: 0.5 },
  },
  hover: {
    scale: 1.03,
    y: -5,
    boxShadow: '0px 10px 20px rgba(0,0,0,0.12)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

const READ_MORE_THRESHOLD = 200;

const BlogCard = ({
  post,
  index,
  isExpanded,
  toggleExpand,
  isOwner,
  isAdmin,
  postRef,
}) => {
  const dispatch = useDispatch();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedBody, setEditedBody] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditClick = () => {
    setEditedTitle(post.title);
    setEditedBody(post.body);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editedTitle.trim()) {
      toast.error('Title cannot be empty.');
      return;
    }
    dispatch(
      updatePost({
        id: post._id,
        updatedData: { title: editedTitle, body: editedBody },
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Post updated successfully!');
        setShowEditModal(false);
      })
      .catch(() => {
        toast.error('Failed to update post.');
      });
  };

  const handleDelete = () => {
    dispatch(deletePost(post._id))
      .unwrap()
      .then(() => {
        toast.success('Post deleted successfully!');
        setShowDeleteConfirm(false);
      })
      .catch(() => {
        toast.error('Failed to delete post.');
        setShowDeleteConfirm(false);
      });
  };

  const shouldTruncate = !isExpanded && post.body.length > READ_MORE_THRESHOLD;
  const displayText = shouldTruncate
    ? post.body.slice(0, READ_MORE_THRESHOLD) + '...'
    : post.body;

  return (
    <>
      <motion.div
        ref={postRef}
        id={post._id}
        className='bg-white dark:bg-neutral p-6 rounded-lg shadow relative cursor-pointer'
        variants={postVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        whileHover='hover'
        transition={{ delay: index * 0.1 }}
        onClick={() => {
          if (!isExpanded) toggleExpand(post._id);
        }}
      >
        <h3 className='text-2xl font-heading font-semibold mb-2'>
          {post.title}
        </h3>

        <p className='text-secondary mb-3'>{displayText}</p>

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
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick();
              }}
              className='px-3 py-1 rounded-md bg-primary text-text font-semibold shadow-sm hover:scale-95 transition duration-150'
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className='px-3 py-1 rounded-md bg-accent text-text font-semibold shadow-sm hover:scale-95 transition duration-150'
            >
              Delete
            </button>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      {showEditModal && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
          onClick={() => setShowEditModal(false)}
        >
          <div
            className='bg-white dark:bg-neutral p-6 rounded-lg w-full max-w-lg'
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-xl font-bold mb-4'>Edit Post</h2>
            <input
              type='text'
              className='w-full mb-4 p-2 border rounded'
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder='Post Title'
            />
            <textarea
              className='w-full mb-4 p-2 border rounded resize-y'
              rows='6'
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              placeholder='Post Body'
            />
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowEditModal(false)}
                className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className='px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className='bg-white dark:bg-neutral p-6 rounded-lg w-full max-w-sm'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-lg font-semibold mb-4'>
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className='px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogCard;
