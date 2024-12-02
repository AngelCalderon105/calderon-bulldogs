import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Initialize the Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY ?? '',  // Ensure this is your Mailgun API key
});

// Check if the domain exists in your environment variables
const domain = process.env.MAILGUN_DOMAIN ?? '';

export const sendResetEmail = async (email: string, token: string) => {
  if (!domain) {
    throw new Error('MAILGUN_DOMAIN is not set in environment variables.');
  }

  // Reset password URL (replace localhost with your domain in production)
  const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;

  const messageData = {
    from: `no-reply@${domain}`, // Ensure this is a valid email using your Mailgun domain
    to: email, // The recipient's email
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link below to reset your password: ${resetUrl}`,
    html: `<p>You requested a password reset. Click the link below to reset your password:</p>
           <a href="${resetUrl}">Reset Password</a>`,
  };

  try {
    // Send the email using Mailgun's API
    const response = await mg.messages.create(domain, messageData);
    console.log(`Password reset email sent to ${email}`);
    console.log('Mailgun response:', response);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    throw new Error('Could not send password reset email.');
  }
};

