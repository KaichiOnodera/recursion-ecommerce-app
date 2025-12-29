export type DeleteReq = {
  '/admin/items/:id': Record<string, never>;
  '/auth/resign': Record<string, never>;
};

export type DeleteRes = {
  '/admin/items/:id': { deleted: boolean };
  '/auth/resign': { success: boolean };
};
