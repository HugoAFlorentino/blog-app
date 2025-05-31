import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts, deletePost, updatePost } from '../redux/blogSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Blogs = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.blogs);
  const [expandedPosts, setExpandedPosts] = useState({});
  const { id } = useParams();

  const postRefs = useRef({});

  // Modal-related state
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedBody, setEditedBody] = useState('');

  // Delete confirmation modal state
  const [deletePostId, setDeletePostId] = useState(null);

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
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Open delete confirmation modal
  const confirmDelete = (postId) => {
    setDeletePostId(postId);
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeletePostId(null);
  };

  // Actually delete post
  const handleDelete = () => {
    if (!deletePostId) return;

    dispatch(deletePost(deletePostId))
      .unwrap()
      .then(() => {
        toast.success('Post deleted successfully!');
        setDeletePostId(null);

        // Refresh page then scroll to bottom after a slight delay
        window.location.reload();

        // Optional: if you want to scroll after reload, you could add a small script on page load,
        // but usually reload resets scroll to top by default.
        // If you want scroll after reload, you would need to save a flag in localStorage or similar.
      })
      .catch(() => {
        toast.error('Failed to delete post.');
        setDeletePostId(null);
      });
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditedTitle(post.title);
    setEditedBody(post.body);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingPost && editedTitle.trim()) {
      dispatch(
        updatePost({
          id: editingPost._id,
          updatedData: {
            title: editedTitle,
            body: editedBody,
          },
        })
      )
        .unwrap()
        .then(() => {
          toast.success('Post updated successfully!');
          setShowModal(false);
          setEditingPost(null);
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          });
        })
        .catch(() => {
          toast.error('Failed to update post.');
        });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingPost(null);
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
                    className='text-primary font-medium hover:underline mr-4'
                  >
                    {isExpanded ? 'Show Less ←' : 'Read More →'}
                  </button>

                  <button
                    onClick={() => handleEdit(post)}
                    className='text-yellow-600 font-medium hover:underline mr-4'
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => confirmDelete(post._id)}
                    className='text-red-600 font-medium hover:underline'
                  >
                    Delete
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <aside className='space-y-6'>
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

          <div className='bg-white dark:bg-neutral p-6 rounded-lg shadow text-center'>
            <p className='text-secondary text-sm mb-2'>Advertisement</p>
            <div className='bg-gray-200 dark:bg-gray-600 h-32 rounded'></div>
          </div>
        </aside>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-neutral p-6 rounded-lg w-full max-w-md shadow-lg'>
            <h2 className='text-xl font-semibold mb-4'>Edit Post</h2>

            <label className='block mb-2 text-sm font-medium'>Title</label>
            <input
              type='text'
              className='w-full p-2 border rounded mb-4'
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />

            <label className='block mb-2 text-sm font-medium'>Body</label>
            <textarea
              className='w-full p-2 border rounded mb-4 h-32'
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
            />

            <div className='flex justify-end space-x-4'>
              <button
                className='bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400'
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className='bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90'
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletePostId && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-neutral p-6 rounded-lg w-full max-w-sm shadow-lg text-center'>
            <h3 className='text-lg font-semibold mb-4'>
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center space-x-6'>
              <button
                onClick={cancelDelete}
                className='px-4 py-2 rounded bg-gray-300 hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
