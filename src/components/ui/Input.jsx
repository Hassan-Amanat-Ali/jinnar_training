import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  className = '',
  type = 'text',
  placeholder = '',
  disabled = false,
  required = false,
  ...props
}) => {
  const baseClasses =
    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  const normalClasses =
    'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500';
  const disabledClasses = 'bg-gray-50 text-gray-500 cursor-not-allowed';

  const inputClasses = `
    ${baseClasses}
    ${error ? errorClasses : normalClasses}
    ${disabled ? disabledClasses : 'bg-white'}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <div className='w-full'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />

      {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}

      {helperText && !error && (
        <p className='mt-2 text-sm text-gray-500'>{helperText}</p>
      )}
    </div>
  );
};

export default Input;
