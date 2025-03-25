import React, { useEffect } from "react";
import { X } from "lucide-react";

interface NotificationProps {
  type: "success" | "error" | "info";
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
  autoClose = true,
  autoCloseTime = 3000,
}) => {
  // Auto-close functionality
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, autoCloseTime, onClose]);

  if (!isVisible) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div className={`fixed top-4 right-4 left-4 p-4 rounded-lg shadow-lg ${bgColor} transition-all duration-300 ease-in-out z-50`}>
      <div className="flex items-center justify-between">
        <p className="text-white font-medium">{message}</p>
        <button className="text-white" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default Notification;
