import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../utils/axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/users/signup', formData);
      navigate('/');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Failed to create user');
      } else if (err.request) {
        setError('Network error, please try again.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background text-text px-4'>
      <div className='w-full max-w-md p-8 rounded-xl shadow-lg bg-neutral'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Sign Up</h2>

        <form className='space-y-5' onSubmit={handleSubmit}>
          {/* USERNAME */}
          <div>
            <label htmlFor='username' className='block mb-1 font-medium'>
              USERNAME
            </label>
            <input
              type='text'
              id='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='username'
              className='w-full px-4 py-2 rounded bg-background text-text border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary'
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor='email' className='block mb-1 font-medium'>
              Email
            </label>
            <input
              type='email'
              id='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='you@example.com'
              className='w-full px-4 py-2 rounded bg-background text-text border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary'
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor='password' className='block mb-1 font-medium'>
              Password
            </label>
            <input
              type='password'
              id='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='••••••••'
              className='w-full px-4 py-2 rounded bg-background text-text border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary'
              required
              disabled={loading}
            />
          </div>

          {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full bg-primary text-white py-2 rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            disabled={loading}
          >
            {loading && (
              <svg
                className='animate-spin h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                ></path>
              </svg>
            )}
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {/* Optional links */}
        <div className='mt-4 text-sm text-center'>
          <Link to='#' className='text-accent hover:underline'>
            Forgot password?
          </Link>
        </div>

        <div className='mt-2 text-sm text-center'>
          Already have an account?{' '}
          <Link to='/signin' className='text-primary hover:underline'>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
