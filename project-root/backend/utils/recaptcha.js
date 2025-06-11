import axios from 'axios';
import { SECRET_KEY } from '../config/env.config.js';

const verifyRecaptcha = async (token) => {
  const secretKey = SECRET_KEY;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'Failed to verify reCAPTCHA' };
  }
};

export default verifyRecaptcha;
