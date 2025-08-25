import React, { useState } from 'react';

const CourseContent = ({ content }) => {
  const [expandedSections, setExpandedSections] = useState(
    content.sections.map((section) => section.expanded)
  );
  const [expandAll, setExpandAll] = useState(false);

  const toggleSection = (index) => {
    const updatedSections = [...expandedSections];
    updatedSections[index] = !updatedSections[index];
    setExpandedSections(updatedSections);
  };

  const handleExpandAll = () => {
    setExpandAll(!expandAll);
    setExpandedSections(content.sections.map(() => !expandAll));
  };

  return (
    <div className='bg-white p-8 rounded-lg border border-gray-100 mb-8'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>Course content</h2>
        <button className='text-primary font-medium' onClick={handleExpandAll}>
          {expandAll ? 'Collapse all sections' : 'Expand all sections'}
        </button>
      </div>
      <div className='text-sm text-gray-600 mb-6'>
        {content.summary.sections} sections • {content.summary.lectures}{' '}
        lectures • Total length: {content.summary.totalLength}
      </div>

      <div className='space-y-4'>
        {content.sections.map((section, i) => (
          <div
            key={i}
            className='border border-gray-200 rounded-md overflow-hidden'
          >
            <div
              className='bg-gray-50 p-4 flex justify-between cursor-pointer hover:bg-gray-100'
              onClick={() => toggleSection(i)}
            >
              <div className='flex items-center'>
                <svg
                  className='w-4 h-4 mr-2'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d={
                      expandedSections[i]
                        ? 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                        : 'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                    }
                    clipRule='evenodd'
                  />
                </svg>
                <span className='font-medium'>{section.title}</span>
              </div>
              <div className='text-sm text-gray-500'>{section.stats}</div>
            </div>

            {expandedSections[i] && section.lectures && (
              <div className='border-t'>
                <ul className='divide-y'>
                  {section.lectures.map((lecture, j) => (
                    <li key={j} className='p-4 flex items-center'>
                      <svg
                        className='w-5 h-5 text-success mr-3'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <div className='flex-1'>
                        <span>{lecture.title}</span>
                      </div>
                      <span className='text-sm text-gray-500'>
                        {lecture.duration}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;
