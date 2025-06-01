import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../redux/userSlice';
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

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [recaptchaToken, setRecaptchaToken] = useState('');
  const widgetIdRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    loadReCaptchaScript()
      .then((grecaptcha) => {
        grecaptcha.ready(() => {
          if (widgetIdRef.current !== null) return;

          widgetIdRef.current = grecaptcha.render('recaptcha-container', {
            sitekey: siteKey,
            size: 'normal',
            callback: (token) => {
              setRecaptchaToken(token);
            },
            'expired-callback': () => {
              setRecaptchaToken('');
              toast.error('reCAPTCHA expired, please complete it again.');
            },
          });
        });
      })
      .catch(() => {
        toast.error('Failed to load reCAPTCHA.');
      });
  }, [siteKey]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const { username, email, password } = formData;

      if (!username || username.trim().length < 3) {
        toast.error('Username must be at least 3 characters long.');
        return;
      }

      if (!email || !email.includes('@')) {
        toast.error('Please enter a valid email address.');
        return;
      }

      if (!password || password.length < 8) {
        toast.error('Password must be at least 8 characters long.');
        return;
      }

      if (!recaptchaToken) {
        toast.error('Please complete the reCAPTCHA challenge.');
        return;
      }

      dispatch(signUpUser({ ...formData, recaptchaToken }));
    },
    [dispatch, formData, recaptchaToken]
  );

  return (
    <div className='min-h-screen flex items-center justify-center bg-background text-text px-4'>
      <div className='w-full max-w-md p-8 rounded-xl shadow-lg bg-neutral'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Sign Up</h2>

        <form className='space-y-5' onSubmit={handleSubmit}>
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
              autoComplete='username'
            />
          </div>

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
              autoComplete='email'
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
              autoComplete='new-password'
            />
          </div>

          <div id='recaptcha-container' className='mt-4' />

          {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary text-white py-2 rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
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
