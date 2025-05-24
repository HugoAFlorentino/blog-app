import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signInUser } from '../redux/userSlice';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // Redirect if already logged in
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
    dispatch(signInUser(formData))
      .unwrap()
      .then(() => navigate('/'))
      .catch(() => {});
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background text-text px-4'>
      <div className='w-full max-w-md p-8 rounded-xl shadow-lg bg-neutral'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Sign In</h2>

        <form className='space-y-5' onSubmit={handleSubmit}>
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className='mt-4 text-sm text-center'>
          <Link to='#' className='text-accent hover:underline'>
            Forgot password?
          </Link>
        </div>

        <div className='mt-2 text-sm text-center'>
          Don't have an account?{' '}
          <Link to='/signup' className='text-primary hover:underline'>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
