import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signInUser } from '../redux/userSlice';
import { toast } from 'react-toastify';

const loadReCaptchaScript = () => {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      resolve(window.grecaptcha);
      return;
    }
    const existingScript = document.getElementById('recaptcha-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.grecaptcha) resolve(window.grecaptcha);
        else reject(new Error('reCAPTCHA not available'));
      });
      return;
    }
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.grecaptcha) resolve(window.grecaptcha);
      else reject(new Error('reCAPTCHA not available'));
    };
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'));
    document.body.appendChild(script);
  });
};

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Load & render reCAPTCHA widget
  useEffect(() => {
    loadReCaptchaScript()
      .then((grecaptcha) => {
        grecaptcha.ready(() => {
          setRecaptchaReady(true);
          // Prevent double render error by checking if widget is already rendered
          if (!document.getElementById('recaptcha-container').hasChildNodes()) {
            grecaptcha.render('recaptcha-container', {
              sitekey: siteKey,
              callback: (token) => {
                setRecaptchaToken(token);
              },
              'expired-callback': () => {
                setRecaptchaToken('');
                toast.error('reCAPTCHA expired, please complete it again.');
              },
            });
          }
        });
      })
      .catch(() => {
        toast.error('Failed to load reCAPTCHA.');
      });
  }, [siteKey]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA challenge.');
      return;
    }

    dispatch(signInUser({ ...formData, recaptchaToken }))
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

          <div id='recaptcha-container' className='mt-4' />

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
          <Link to='/forgot-password' className='text-accent hover:underline'>
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
