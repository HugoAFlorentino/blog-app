import sendThankYouEmail from '../utils/subscriptionEmail.js';

export const sendThankYou = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    await sendThankYouEmail(email);
    return res.status(200).json({ message: 'Thank you email sent.' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to send email.', error: error.message });
  }
};
