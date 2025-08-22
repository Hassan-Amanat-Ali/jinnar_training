import React from 'react';
import { MdPersonOutline } from 'react-icons/md';
import { MdAccessTime } from 'react-icons/md';
const Card = ({
  children,
  className = '',
  image,
  title,
  description,
  duration,
  students,
  actionButtons,
  padding = true,
  shadow = true,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  const shadowClasses = shadow
    ? 'shadow-sm hover:shadow-lg transition-shadow duration-300'
    : '';

  const classes = `
    ${baseClasses}
    ${shadowClasses}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <div className={classes} {...props}>
      {/* Course Image */}
      {image && (
        <div className='w-full h-48 overflow-hidden'>
          <img src={image} alt={title} className='w-full h-full object-cover' />
        </div>
      )}

      {/* Card Content */}
      <div className={padding ? 'p-6' : ''}>
        {/* Course Title */}
        {title && (
          <h3 className='text-xl font-semibold text-black mb-3 line-clamp-2'>
            {title}
          </h3>
        )}

        {/* Course Description */}
        {description && (
          <p className='text-black/80 mb-4 text-sm leading-relaxed line-clamp-3'>
            {description}
          </p>
        )}

        {(duration || students) && (
          <div className='flex items-center gap-4 mb-6 text-sm text-black/80'>
            {duration && (
              <div className='flex items-center gap-1'>
                <MdAccessTime className='h-5 w-5' />
                <span>{duration}</span>
              </div>
            )}
            {students && (
              <div className='flex items-center gap-1'>
                <MdPersonOutline className='w-5 h-5' />
                <span>{students}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {actionButtons && (
          <div className='flex-col lg:flex-row flex gap-3'>{actionButtons}</div>
        )}

        {/* Fallback for custom content */}
        {!title && !description && !image && children}
      </div>
    </div>
  );
};

export default Card;
