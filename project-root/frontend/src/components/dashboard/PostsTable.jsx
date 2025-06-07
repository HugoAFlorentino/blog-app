// src/components/Dashboard/PostsTable.jsx
import React from 'react';

const PostsTable = ({
  posts,
  users,
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) => {
  return (
    <section className='mt-20'>
      <h2 className='text-4xl font-heading font-extrabold text-primary mb-6'>
        Blog Posts
      </h2>

      <p className='mb-4'>Author name only visible for Admin</p>
      <div className='overflow-x-auto bg-neutral rounded-xl shadow-md border border-primary mb-6'>
        <table className='min-w-full divide-y divide-primary'>
          <thead className='bg-primary/10'>
            <tr>
              <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                Title
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold text-primary'>
                Author
              </th>
              <th className='px-6 py-3 text-center text-sm font-semibold text-primary'>
                Status
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-primary'>
            {posts.length === 0 && (
              <tr>
                <td colSpan='3' className='text-center py-6 text-secondary'>
                  No posts to display.
                </td>
              </tr>
            )}
            {posts.map((post, idx) => {
              const postId = post._id || post.id || `author-post-${idx}`;
              const authorId = post.author?._id || post.author;
              const author = users.find((u) => (u._id || u.id) === authorId);
              return (
                <tr key={postId} className='hover:bg-primary transition-colors'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {post.title || 'Untitled'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {author?.username || 'author'}
                  </td>
                  <td className='px-6 py-4 text-center'>
                    {post.deleted ? 'deleted' : 'active'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className='flex justify-between items-center max-w-sm mx-auto'>
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className='btn-secondary'
        >
          Previous
        </button>
        <span className='text-secondary font-semibold'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className='btn-secondary'
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default PostsTable;
