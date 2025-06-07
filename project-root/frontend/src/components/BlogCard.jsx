import React, { memo } from 'react';
import { motion } from 'framer-motion';

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

const BlogCard = memo(({
  post,
  index,
  isExpanded,
  toggleExpand,
  isOwner,
  isAdmin,
  handleEdit,
  confirmDelete,
  postRef,
}) => (
  <motion.div
    ref={postRef}
    id={post._id}
    className='bg-white dark:bg-neutral p-6 rounded-lg shadow'
    variants={postVariants}
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true, amount: 0.3 }}
    whileHover='hover'
    transition={{ delay: index * 0.1 }}
  >
    <h3 className='text-2xl font-heading font-semibold mb-2'>{post.title}</h3>

    <p className={`text-secondary mb-3 ${!isExpanded ? 'line-clamp-3' : ''}`}>
      {post.body}
    </p>

    <p className='text-sm text-gray-500 mb-2'>
      Author:{' '}
      <span className='font-medium'>{post.author?.username || 'Unknown'}</span>
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
      <div onClick={(e) => e.stopPropagation()} className='flex space-x-4 mt-4'>
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
));

export default BlogCard;
