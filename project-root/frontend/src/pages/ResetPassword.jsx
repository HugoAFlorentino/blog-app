import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../redux/userSlice';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { id, token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ id, token, password }));
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => navigate('/signin'), 2000);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-background text-text px-4'>
      <div className='w-full max-w-md p-8 rounded-xl shadow-lg bg-neutral'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <input
            type='password'
            placeholder='Enter new password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-full px-4 py-2 rounded bg-background text-text border border-gray-300'
          />

          {message && <p className='text-green-500 text-sm'>{message}</p>}
          {error && <p className='text-red-500 text-sm'>{error}</p>}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary text-white py-2 rounded hover:opacity-90 transition disabled:opacity-50'
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
