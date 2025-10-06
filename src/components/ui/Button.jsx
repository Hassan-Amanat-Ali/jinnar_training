import React from "react";

const Button = ({ text, icon, className = "", onClick, href, ...props }) => {
  const baseClasses = `flex items-center justify-center font-semibold ${className}`;

  // If href is provided, render as a link
  if (href) {
    return (
      <a href={href} className={baseClasses} {...props}>
        {text}
        {icon && <span className="ml-2 ">{icon}</span>}
      </a>
    );
  }

  // Otherwise render as a button
  return (
    <button className={baseClasses} onClick={onClick} {...props}>
      {text}
      {icon && <span className="ml-2 ">{icon}</span>}
    </button>
  );
};

export default Button;
