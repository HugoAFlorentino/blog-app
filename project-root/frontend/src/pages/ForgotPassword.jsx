import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearMessage } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message } = useSelector((state) => state.user);

  // Clear messages when email changes, but keep submitted status until user navigates
  useEffect(() => {
    dispatch(clearMessage());
  }, [email, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(forgotPassword(email))
      .unwrap()
      .then(() => {
        setSubmitted(true);
      })
      .catch(() => {
        setSubmitted(false);
      });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background text-text px-4'>
      <div className='w-full max-w-md p-8 rounded-xl shadow-lg bg-neutral'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <input
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitted}
            className='w-full px-4 py-2 rounded bg-background text-text border border-gray-300'
          />

          {message && !error && (
            <p className='text-green-500 text-sm'>{message}</p>
          )}

          {submitted && !error && (
            <button
              type='button'
              onClick={() => navigate('/')}
              className='mt-4 w-full bg-secondary text-white py-2 rounded hover:opacity-90 transition'
            >
              Back to Home
            </button>
          )}

          {error && <p className='text-red-500 text-sm'>{error}</p>}

          <button
            type='submit'
            disabled={loading || submitted}
            className='w-full bg-primary text-white py-2 rounded hover:opacity-90 transition disabled:opacity-50'
          >
            {loading
              ? 'Sending...'
              : submitted
              ? 'Check your email'
              : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
