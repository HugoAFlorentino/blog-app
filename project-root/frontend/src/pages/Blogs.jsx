import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../redux/blogSlice.js';
import { useParams } from 'react-router-dom';
import BlogCard from '../components/blog/BlogCard.jsx';
import AdSidebar from '../components/blog/AdSidebar.jsx';

const Blogs = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.blogs);
  const currentUser = useSelector((state) => state.user?.currentUser);
  const { id } = useParams();

  const [expandedPosts, setExpandedPosts] = useState({});
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
      setExpandedPosts((prev) => ({ ...prev, [id]: true }));
    }
  }, [id, posts]);

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
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
                    postRef={(el) => (postRefs.current[post._id] = el)}
                  />
                );
              })
          )}
        </div>

        <div className='mt-10 lg:mt-0'>
          <AdSidebar />
        </div>
      </div>
    </div>
  );
};

export default Blogs;
