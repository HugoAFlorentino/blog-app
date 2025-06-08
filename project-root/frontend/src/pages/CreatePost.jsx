import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPost,
  clearError,
  clearMessage,
  getAllPosts,
} from '../redux/blogSlice.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, message } = useSelector((state) => state.blogs);
  const hasSubmitted = useRef(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      toast.error('Title and Body are required');
      dispatch(clearMessage());
      return;
    }

    dispatch(createPost({ title, body }))
      .unwrap()
      .then(() => {
        dispatch(getAllPosts());
      })
      .catch(() => {});

    hasSubmitted.current = true;
  };

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    if (message && hasSubmitted.current) {
      setTitle('');
      setBody('');
      toast.success(message);

      const timeout = setTimeout(() => {
        dispatch(clearMessage());
        navigate('/blogs');
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [message, navigate, dispatch]);

  return (
    <div className='max-w-3xl mx-auto px-4 md:px-0 py-12'>
      <h1 className='text-primary text-3xl font-heading font-bold mb-8'>
        Create New Blog Post
      </h1>

      {error && (
        <div className='mb-4 p-3 bg-accent text-white rounded'>
          {error}
          <button onClick={() => dispatch(clearError())} className='ml-2'>
            x
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label
            htmlFor='title'
            className='block mb-2 font-semibold text-primary'
          >
            Title <span className='text-accent'>*</span>
          </label>
          <input
            id='title'
            type='text'
            placeholder='Enter blog title'
            className='w-full bg-white dark:bg-neutral rounded border border-secondary p-3 text-text placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor='body'
            className='block mb-2 font-semibold text-primary'
          >
            Body <span className='text-accent'>*</span>
          </label>
          <textarea
            id='body'
            rows={10}
            placeholder='Write your blog content here...'
            className='w-full bg-white dark:bg-neutral rounded border border-secondary p-3 text-text placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary resize-vertical'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='bg-primary text-text px-6 py-3  rounded-md font-semibold shadow-sm hover:scale-95 duration-300 transition'
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
