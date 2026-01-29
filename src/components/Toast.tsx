'use client';

import { useToastStore } from '@/lib/store';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm"
      role="region"
      aria-label="Notificações"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg border shadow-lg animate-slide-in flex items-start gap-3 ${getStyles(toast.type)}`}
          role="alert"
        >
          {getIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900">{toast.title}</h4>
            {toast.message && (
              <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label="Fechar notificação"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );
}
