import React from 'react';

const Blogs = () => {
  return (
    <div className='px-4 md:px-12 max-w-7xl mx-auto py-12'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-10'>
        {/* Main Content */}
        <div className='lg:col-span-3 space-y-8'>
          <h2 className='text-3xl font-heading font-bold mb-6'>
            All Blog Posts
          </h2>

          {[1, 2, 3, 4, 5].map((post) => (
            <div
              key={post}
              className='bg-white dark:bg-neutral p-6 rounded-lg shadow hover:shadow-md transition'
            >
              <h3 className='text-2xl font-heading font-semibold mb-2'>
                Blog Post Title #{post}
              </h3>
              <p className='text-secondary mb-3'>
                This is a short description of the blog post. It gives the
                reader a quick idea of what the post is about.
              </p>
              <button className='text-primary font-medium hover:underline'>
                Read More →
              </button>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className='space-y-6'>
          {/* Newsletter Signup / Ad Box */}
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
