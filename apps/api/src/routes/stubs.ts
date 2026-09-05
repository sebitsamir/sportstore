import { Router } from 'express';
import { API_ENDPOINTS } from '@sport-store/shared';

/**
 * Placeholder routes mirroring API_ENDPOINTS.
 * Return 501 until Postgres + real handlers are implemented.
 */
export const stubRouter = Router();

function notImplemented(_req: unknown, res: { status: (n: number) => { json: (b: object) => void } }) {
  res.status(501).json({
    message: 'Not implemented — connect PostgreSQL and implement this endpoint.',
  });
}

const paths = [
  API_ENDPOINTS.PRODUCTS,
  API_ENDPOINTS.PRODUCT_BY_ID,
  API_ENDPOINTS.RELATED_PRODUCTS,
  API_ENDPOINTS.PRODUCT_REVIEWS,
  API_ENDPOINTS.CATEGORIES,
  API_ENDPOINTS.CART,
  API_ENDPOINTS.CART_ADD,
  API_ENDPOINTS.CART_UPDATE,
  API_ENDPOINTS.CART_REMOVE,
  API_ENDPOINTS.PROMO_VALIDATE,
  API_ENDPOINTS.LOGIN,
  API_ENDPOINTS.REGISTER,
  API_ENDPOINTS.LOGOUT,
  API_ENDPOINTS.ME,
  API_ENDPOINTS.FORGOT_PASSWORD,
  API_ENDPOINTS.CHECKOUT,
  API_ENDPOINTS.ORDERS,
  API_ENDPOINTS.ORDER_BY_ID,
  API_ENDPOINTS.USER_PROFILE,
  API_ENDPOINTS.USER_ORDERS,
  API_ENDPOINTS.USER_WISHLIST,
  API_ENDPOINTS.USER_ADDRESSES,
  API_ENDPOINTS.CONTACT,
  API_ENDPOINTS.NEWSLETTER,
];

for (const path of paths) {
  stubRouter.all(path, notImplemented);
}
