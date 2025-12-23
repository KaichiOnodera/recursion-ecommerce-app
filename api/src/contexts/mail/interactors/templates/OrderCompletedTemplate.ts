export const ORDER_COMPLETED_TEMPLATE = (cartId: string) => ({
  subject: 'Order Completed',
  text: `Your order with ID ${cartId} has been delivered.`,
  html: `<p>Your order with ID <strong>${cartId}</strong> has been delivered.</p>`,
});
