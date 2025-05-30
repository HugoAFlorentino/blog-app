import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../redux/blogSlice'; // adjust path if needed
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts, loading, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  // Get last 3 posts (assuming posts sorted oldest → newest, so slice last 3 and reverse for newest first)
  const lastThreePosts = posts.slice(-3).reverse();

  return (
    <div className='px-4 md:px-12 max-w-7xl mx-auto'>
      {/* Hero */}
      <motion.section
        className='bg-primary text-white rounded-2xl p-10 text-center mb-12 shadow-md'
        initial='hidden'
        animate='visible'
        variants={fadeUp}
      >
        <h1 className='text-4xl md:text-6xl font-heading font-bold mb-4'>
          Welcome to My Blog
        </h1>
        <p className='text-lg md:text-xl mb-6'>
          Insights, stories, and updates from the world of tech and design.
        </p>
        <motion.button
          className='bg-white text-primary px-6 py-2 rounded-full font-semibold hover:bg-neutral transition'
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/blogs')}
        >
          Explore Posts
        </motion.button>
      </motion.section>

      {/* Highlights Bar */}
      <motion.div
        className='flex space-x-4 overflow-x-auto mb-10 py-3 border-b border-secondary text-sm md:text-base font-medium'
        initial='hidden'
        animate='visible'
        variants={fadeUp}
        custom={0.2}
      >
        <span className='whitespace-nowrap text-accent'>
          🔥 Breaking: New Framework Released
        </span>
        <span className='whitespace-nowrap'>🌐 Design Trends 2025</span>
        <span className='whitespace-nowrap'>
          💡 10 JavaScript Tips You Missed
        </span>
        <span className='whitespace-nowrap'>🎨 Dark Mode Best Practices</span>
      </motion.div>

      {/* Featured Post */}
      <motion.section
        className='mb-16'
        initial='hidden'
        animate='visible'
        variants={fadeUp}
        custom={0.3}
      >
        <div className='bg-background rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row'>
          <motion.img
            src='https://source.unsplash.com/800x500/?technology,code'
            alt='Featured'
            className='w-full md:w-1/2 object-cover'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
          <div className='p-6 md:w-1/2'>
            <h2 className='text-2xl font-heading font-bold mb-2'>
              How AI is Changing Web Development
            </h2>
            <p className='text-secondary mb-4'>
              Explore how tools like GPT and automation are revolutionizing the
              front-end workflow for developers and designers.
            </p>
            <button
              className='text-primary font-semibold hover:underline'
              onClick={() => navigate('/blogs')}
            >
              Read More →
            </button>
          </div>
        </div>
      </motion.section>

      {/* Latest Posts */}
      <section>
        <h3 className='text-2xl font-heading font-semibold mb-6'>
          Latest Posts
        </h3>

        {loading && <p>Loading posts...</p>}
        {error && <p className='text-red-500'>{error}</p>}

        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {lastThreePosts.map((post, i) => (
            <motion.div
              key={post._id}
              className='bg-white dark:bg-neutral p-4 rounded-lg shadow hover:shadow-md transition'
              initial='hidden'
              animate='visible'
              variants={fadeUp}
              custom={0.4 + i * 0.1}
            >
              <h4 className='text-lg font-semibold mb-2'>{post.title}</h4>
              <p className='text-sm text-secondary mb-2 line-clamp-3'>
                {post.body.length > 100
                  ? post.body.substring(0, 100) + '...'
                  : post.body}
              </p>

              {/* Author */}
              {post.author && (
                <p className='text-xs text-gray-500 mb-2'>
                  By <span className='font-medium'>{post.author.username}</span>
                </p>
              )}

              <button
                onClick={() => navigate(`/blogs/${post._id}`)}
                className='text-sm text-primary hover:underline'
              >
                Read More →
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
