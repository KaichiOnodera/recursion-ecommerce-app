export const CONFIRM_PURCHASE_TEMPLATE = (cartId: number) => ({
  subject: 'Order Completed',
  text: `Your order with ID ${cartId} has been completed.`,
  html: `<p>Your order with ID <strong>${cartId}</strong> has been completed.</p>`,
});
