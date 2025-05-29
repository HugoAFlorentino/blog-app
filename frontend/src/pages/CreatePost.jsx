import React, { useState } from 'react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim() || !body.trim()) {
      setError('Title and Body are required.');
      setSuccess('');
      return;
    }

    setError('');

    setSuccess('Blog post created successfully!');

    setTitle('');
    setBody('');
  };

  return (
    <div className='max-w-3xl mx-auto px-4 md:px-0 py-12'>
      <h1 className='text-primary text-3xl font-heading font-bold mb-8'>
        Create New Blog Post
      </h1>

      {error && (
        <div className='mb-4 p-3 bg-accent text-white rounded'>{error}</div>
      )}
      {success && (
        <div className='mb-4 p-3 bg-primary text-white rounded'>{success}</div>
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
            className='w-full rounded border border-secondary p-3 text-text placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary'
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
            className='w-full rounded border border-secondary p-3 text-text placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary resize-vertical'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        <button
          type='submit'
          className='bg-primary text-white px-6 py-3 rounded font-semibold hover:bg-opacity-90 transition'
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
