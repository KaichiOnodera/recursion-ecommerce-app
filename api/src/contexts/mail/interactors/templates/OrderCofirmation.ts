export const ORDER_CONFIRMATION_TEMPLATE = (cartId: string) => ({
  subject: 'Order Confirmation',
  text: `Your order with ID ${cartId} has been confirmed.`,
  html: `<p>Your order with ID <strong>${cartId}</strong> has been confirmed.</p>`,
});
