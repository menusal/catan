import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Mount animation
    requestAnimationFrame(() => setIsVisible(true));

    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(autoCloseTimer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-100 shadow-emerald-500/20',
    error: 'bg-red-50 border-red-100 shadow-red-500/20',
    info: 'bg-blue-50 border-blue-100 shadow-blue-500/20',
  };

  const textColors = {
    success: 'text-emerald-900',
    error: 'text-red-900',
    info: 'text-blue-900',
  };

  return (
    <div 
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[999] transition-all duration-300 ease-out pointer-events-auto
        w-[calc(100%-2rem)] sm:w-auto
        ${isVisible && !isClosing ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
    >
      <div className={`flex items-center gap-4 px-6 py-4 rounded-[2rem] border-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ${bgColors[type]} w-full sm:max-w-md backdrop-blur-sm`}>
        <div className="shrink-0">{icons[type]}</div>
        <div className={`flex-1 text-xs font-black uppercase tracking-tight leading-tight ${textColors[type]}`}>
          {message}
        </div>
        <button 
          onClick={handleClose}
          className="p-1 hover:bg-black/5 rounded-full transition-colors text-slate-400"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Notification;
