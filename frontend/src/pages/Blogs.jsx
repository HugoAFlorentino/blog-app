import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../redux/blogSlice';
import { useParams } from 'react-router-dom';

const Blogs = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.blogs);
  const [expandedPosts, setExpandedPosts] = useState({}); // track expanded posts by id
  const { id } = useParams();

  // Refs to each post for scrolling
  const postRefs = useRef({});

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    if (id && postRefs.current[id]) {
      postRefs.current[id].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      // Optionally expand the post when navigated to by id
      setExpandedPosts((prev) => ({ ...prev, [id]: true }));
    }
  }, [id, posts]);

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className='px-4 md:px-12 max-w-7xl mx-auto py-12'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-10'>
        {/* Main Content */}
        <div className='lg:col-span-3 space-y-8'>
          <h2 className='text-3xl font-heading font-bold mb-6'>
            All Blog Posts
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className='text-accent'>{error}</p>
          ) : (
            posts.map((post) => {
              const isExpanded = expandedPosts[post._id];

              return (
                <div
                  key={post._id}
                  ref={(el) => (postRefs.current[post._id] = el)}
                  id={post._id}
                  className='bg-white dark:bg-neutral p-6 rounded-lg shadow hover:shadow-md transition'
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
                    className='text-primary font-medium hover:underline'
                  >
                    {isExpanded ? 'Show Less ←' : 'Read More →'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <aside className='space-y-6'>
          {/* Newsletter Signup */}
          <div className='bg-background p-6 rounded-lg shadow'>
            <h4 className='text-xl font-heading font-semibold mb-2'>
              Subscribe to our Newsletter
            </h4>
            <p className='text-sm text-secondary mb-3'>
              Get the latest posts delivered straight to your inbox.
            </p>
            <input
              type='email'
              placeholder='you@example.com'
              className='w-full px-4 py-2 rounded mb-3 border border-secondary focus:outline-none'
            />
            <button className='w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 transition'>
              Subscribe
            </button>
          </div>

          {/* Ad Placeholder */}
          <div className='bg-white dark:bg-neutral p-6 rounded-lg shadow text-center'>
            <p className='text-secondary text-sm mb-2'>Advertisement</p>
            <div className='bg-gray-200 dark:bg-gray-600 h-32 rounded'></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Blogs;
