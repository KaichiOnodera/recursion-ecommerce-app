import { useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router';
import {
  RedirectReason,
  RedirectReasonType,
} from '../constants/redirectReasons';
import { redirectConfig, RedirectContext } from '../config/redirectConfig';
import { getSafeRedirectPath } from '../utils/redirect';

/**
 * 統一的なリダイレクトAPI
 *
 * 使用例:
 *   const redirect = useRedirect();
 *   redirect(RedirectReason.LOGIN_SUCCESS);
 *   redirect(RedirectReason.AUTH_REQUIRED, { currentPath: '/cart' });
 */
export const useRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  return useCallback(
    (reason: RedirectReasonType, context?: RedirectContext) => {
      const rule = redirectConfig[reason];
      if (!rule) {
        console.warn(`Unknown redirect reason: ${reason}`);
        return;
      }

      // ログイン成功時は、redirectパラメータを優先的に処理
      if (reason === RedirectReason.LOGIN_SUCCESS) {
        const redirectParam = getSafeRedirectPath(searchParams);
        if (redirectParam) {
          navigate(redirectParam, { replace: true });
          return;
        }
      }

      // リダイレクト先を決定
      const target =
        typeof rule.target === 'function'
          ? rule.target({ ...context, currentPath: location.pathname })
          : rule.target;

      // リダイレクト実行
      const method = rule.method || 'replace';
      navigate(target, { replace: method === 'replace' });
    },
    [navigate, location, searchParams],
  );
};
