declare module 'stripe' {
  namespace Stripe {
    namespace Checkout {
      interface Session {
        shipping_details?: {
          address?: Stripe.Address;
        };
      }
    }
  }
}
