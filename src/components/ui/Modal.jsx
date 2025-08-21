import React, { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className = '',
  closeOnBackdrop = true,
  showCloseButton = true,
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'
      onClick={handleBackdropClick}
    >
      <div
        className={`
        bg-white rounded-lg shadow-xl w-full ${sizes[size]} ${className}
        transform transition-all duration-200 scale-100
      `}
      >
        {(title || showCloseButton) && (
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            {title && (
              <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
