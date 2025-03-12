import React from 'react';
import ReactModal from 'react-modal';
import { IconWrapper } from './icons';
import { BsX } from 'react-icons/bs';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  footer,
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`relative w-full ${sizeClasses[size]} rounded-lg bg-white shadow-lg dark:bg-boxdark outline-none overflow-hidden`}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 p-4"
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      preventScroll={true}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stroke p-4 dark:border-strokedark">
        <h3 id="modal-title" className="text-xl font-semibold text-black dark:text-white">
          {title}
        </h3>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Cerrar modal"
          >
            <IconWrapper className="flex h-6 w-6 fill-current items-center justify-center">
              <BsX size={20} />
            </IconWrapper>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="flex justify-end gap-3 border-t border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4">
          {footer}
        </div>
      )}
    </ReactModal>
  );
};

export default Modal;
