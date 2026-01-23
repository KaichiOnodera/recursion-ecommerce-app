import React, { useEffect } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const ToastItem: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const bgColor =
    toast.type === 'success'
      ? 'bg-green-50 border-green-200'
      : toast.type === 'error'
        ? 'bg-red-50 border-red-200'
        : 'bg-blue-50 border-blue-200';

  const textColor =
    toast.type === 'success'
      ? 'text-green-800'
      : toast.type === 'error'
        ? 'text-red-800'
        : 'text-blue-800';

  const iconColor =
    toast.type === 'success'
      ? 'text-green-500'
      : toast.type === 'error'
        ? 'text-red-500'
        : 'text-blue-500';

  const Icon = toast.type === 'success' ? CheckCircleIcon : XCircleIcon;

  return (
    <div
      className={`${bgColor} ${textColor} border rounded-lg shadow-lg p-4 mb-3 flex items-start gap-3 min-w-[300px] max-w-[500px] animate-slide-in-right`}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="閉じる"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
