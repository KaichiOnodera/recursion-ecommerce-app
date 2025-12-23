export const ORDER_COMPLETED_TEMPLATE = (orderId: string) => ({
  subject: 'Order Completed',
  text: `Your order with ID ${orderId} has been delivered.`,
  html: `<p>Your order with ID <strong>${orderId}</strong> has been delivered.</p>`,
});
