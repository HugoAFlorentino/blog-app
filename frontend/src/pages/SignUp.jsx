import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../redux/userSlice';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signUpUser(formData));
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background text-text px-4'>
      <div className='w-full max-w-md p-8 rounded-xl shadow-lg bg-neutral'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Sign Up</h2>

        <form className='space-y-5' onSubmit={handleSubmit}>
          {/* USERNAME */}
          <div>
            <label htmlFor='username' className='block mb-1 font-medium'>
              Username
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

          {/* Error Message */}
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
