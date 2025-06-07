import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllPosts } from '../redux/blogSlice.js';
import newsData from '../utils/newsData.js';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const fadeInOut = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.4, ease: 'easeIn' } },
};

const Highlights = React.memo(() => (
  <motion.div
    className='flex justify-around space-x-4 overflow-x-auto mb-10 py-3 border-b border-secondary text-sm md:text-base font-medium'
    initial='hidden'
    animate='visible'
    variants={fadeUp}
    custom={0.2}
  >
    <a
      href='https://www.reuters.com/technology/'
      target='_blank'
      rel='noopener noreferrer'
      className='whitespace-nowrap text-accent'
    >
      🔥 Breaking News
    </a>
    <a
      href='https://medium.com/codeart-mk/ux-ui-trends-2025-818ea752c9f7'
      target='_blank'
      rel='noopener noreferrer'
      className='whitespace-nowrap text-accent'
    >
      🌐 Design Trends 2025
    </a>
    <a
      href='https://www.geekwire.com/'
      target='_blank'
      rel='noopener noreferrer'
      className='whitespace-nowrap text-accent'
    >
      💡 GeekWire
    </a>
    <a
      href='https://www.designstudiouiux.com/blog/dark-mode-ui-design-best-practices/'
      target='_blank'
      rel='noopener noreferrer'
      className='whitespace-nowrap text-accent'
    >
      🎨 Dark Mode Best Practices
    </a>
  </motion.div>
));

const Carousel = React.memo(
  ({ currentNews, onPrev, onNext, isPaused, setIsPaused }) => (
    <motion.section
      className='mb-16'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={fadeUp}
      custom={0.3}
    >
      <div
        className='relative bg-white dark:bg-neutral rounded-xl overflow-hidden shadow-lg flex flex-col w-full max-w-6xl mx-auto h-auto md:h-[500px]'
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className='flex flex-col md:flex-row h-full'>
          <motion.img
            key={currentNews.id}
            src={currentNews.image}
            alt={currentNews.title}
            className='hidden md:block object-cover w-full md:w-1/2 h-[500px]'
            variants={fadeInOut}
            initial='initial'
            animate='animate'
            exit='exit'
            loading='lazy'
            fetchpriority='low'
            decoding='async'
          />

          <motion.div
            key={currentNews.id + '-text'}
            className='p-6 flex flex-col justify-between min-h-[300px] md:min-h-full w-full md:w-1/2'
            variants={fadeInOut}
            initial='initial'
            animate='animate'
            exit='exit'
          >
            <div>
              <h2 className='text-2xl font-heading font-bold mb-2'>
                {currentNews.title}
              </h2>
              <p className='text-secondary mb-4'>{currentNews.description}</p>
            </div>
            <button
              className='bg-primary text-text px-4 py-2 rounded-md font-semibold shadow-sm hover:scale-95 duration-300 transition self-start'
              onClick={() => (window.location.href = '/news')}
            >
              Read More →
            </button>
          </motion.div>
        </div>

        <button
          onClick={onPrev}
          aria-label='Previous Slide'
          className='absolute top-1/2 left-2 -translate-y-1/2 bg-primary bg-opacity-70 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-90 transition'
        >
          ‹
        </button>
        <button
          onClick={onNext}
          aria-label='Next Slide'
          className='absolute top-1/2 right-2 -translate-y-1/2 bg-primary bg-opacity-70 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-90 transition'
        >
          ›
        </button>
      </div>
    </motion.section>
  )
);

const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { posts, loading, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    if (!posts.length) dispatch(getAllPosts());
  }, [dispatch, posts.length]);

  const lastThreePosts = Array.isArray(posts) ? posts.slice(-3).reverse() : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? newsData.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === newsData.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % newsData.length);
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  useEffect(() => {
    const handleVisibilityChange = () => setIsPaused(document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const currentNews = newsData[currentIndex];

  return (
    <div className='px-4 md:px-12 max-w-7xl mx-auto' key={location.pathname}>
      <motion.section
        className='bg-primary text-text rounded-2xl p-10 text-center mb-12 shadow-md'
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
          className='bg-background text-text px-6 py-2 rounded-full font-semibold hover:bg-neutral transition'
          whileHover={{ scale: 0.95 }}
          onClick={() => navigate('/blogs')}
        >
          Explore Posts
        </motion.button>
      </motion.section>

      <Highlights />
      <Carousel
        currentNews={currentNews}
        onPrev={prevSlide}
        onNext={nextSlide}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
      />

      <section>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.35}
        >
          <h3 className='text-2xl font-heading font-semibold mb-6'>
            Latest Posts
          </h3>
        </motion.div>

        {loading && <p>Loading posts...</p>}
        {error && <p className='text-red-500'>{error}</p>}

        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {lastThreePosts.map((post, i) => (
            <motion.div
              key={post._id}
              className='bg-white dark:bg-neutral p-4 rounded-lg shadow hover:shadow-md transition'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.4 + i * 0.1}
            >
              <h4 className='text-lg font-semibold mb-2'>{post.title}</h4>
              <p className='text-sm text-secondary mb-2 line-clamp-3'>
                {post.body.length > 100
                  ? post.body.substring(0, 100) + '...'
                  : post.body}
              </p>
              {post.author && (
                <p className='text-xs text-gray-500 mb-2'>
                  By <span className='font-medium'>{post.author.username}</span>
                </p>
              )}
              <button
                onClick={() => navigate(`/blogs/${post._id}`)}
                className='bg-primary text-text px-4 py-2 rounded-md font-semibold shadow-sm hover:scale-95 duration-300 transition'
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
