import React from 'react';

const Button = ({ text, icon, className = '', onClick, ...props }) => {
  return (
    <button
      className={`flex items-center justify-center font-semibold ${className}`}
      onClick={onClick}
      {...props}
    >
      {text}
      {icon && <span className='ml-2 '>{icon}</span>}
    </button>
  );
};

export default Button;
