import axios from 'axios';
import { BREVO_API_KEY, BREVO_SENDER_EMAIL } from '../config/env.config.js';

const sendEmail = async (to, subject, html) => {
  try {
    const data = {
      sender: { email: BREVO_SENDER_EMAIL, name: 'Blogify Press' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
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

export default sendEmail;
