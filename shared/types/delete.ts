export type DeleteReq = {
  '/admin/items/:id': Record<string, never>;
  '/auth/resign': Record<string, never>;
  '/favorites/:itemId': Record<string, never>;
  '/wishlist/:wishlistId/items/:itemId': Record<string, never>;
  '/wishlist/:wishlistId': Record<string, never>;
  '/admin/tags/:id': Record<string, never>;
};

export type DeleteRes = {
  '/admin/items/:id': { deleted: boolean };
  '/auth/resign': { success: boolean };
  '/favorites/:itemId': { message: string };
  '/wishlist/:wishlistId/items/:itemId': { message: string };
  '/wishlist/:wishlistId': { message: string };
  '/admin/tags/:id': { success: boolean };
};
