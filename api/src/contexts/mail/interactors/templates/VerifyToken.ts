export const VERIFY_TOKEN_TEMPLATE = (
  email: string,
  verificationUrl: string,
) => ({
  subject: 'Verify Your Email Address',
  text: `Hello,\n\nPlease verify your email address by clicking the link below:\n${verificationUrl}\n\nThank you!`,
  html: `<p>Hello,</p><p>Please verify your email address by clicking the link below:</p><a href="${verificationUrl}">Verify Email</a><p>Thank you!</p>`,
});
