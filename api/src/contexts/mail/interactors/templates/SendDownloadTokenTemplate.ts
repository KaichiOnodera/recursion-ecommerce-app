import { EmailMessage } from '../../domains/entities/EmailMessage';

export const SEND_DOWNLOAD_TOKEN_TEMPLATE = (
  to: string,
  orderId: number,
  downloadLink: string,
  firstName?: string,
): EmailMessage => {
  const name = firstName ?? 'Customer';

  return {
    to,
    subject: `Your Download Link for Order #${orderId}`,
    text: `Hi ${name},

Thank you for your purchase!
Download your digital item here: ${downloadLink}

This link may be limited to one-time use.
Best regards,
The E-Commerce Team`,
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for your purchase!</p>
      <p>
        You can download your digital item using the link below:
      </p>
      <p>
        <a href="${downloadLink}" target="_blank" rel="noopener noreferrer">
          Download Your Item
        </a>
      </p>
      <p><strong>Note:</strong> This link may be limited to one-time use.</p>
      <p>Best regards,<br/>The E-Commerce Team</p>
    `,
  };
};
