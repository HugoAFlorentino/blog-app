// sendThankYouEmail.js
import axios from 'axios';
import { BREVO_API_KEY, BREVO_SENDER_EMAIL } from '../config/env.config.js';

const sendThankYouEmail = async (to) => {
  try {
    const data = {
      sender: { email: BREVO_SENDER_EMAIL, name: 'Blogify Press' },
      to: [{ email: to }],
      subject: 'Thank you for subscribing to Blogify Press!',
      htmlContent: `
        <h1>Thanks for subscribing!</h1>
        <p>We're excited to have you on board. Stay tuned for updates.</p>
      `,
    };

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      'Brevo API send error:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export default sendThankYouEmail;
