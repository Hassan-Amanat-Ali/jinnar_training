import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const baseDescription =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

const courses = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: 'Artificial Intelligence (AI) Training Courses',
  description: baseDescription,
  image: '/src/assets/images/course-1.png',
  progressText: '23 of 50 lesson completed',
}));

const ProgressCard = () => {
  return (
    <div className='rounded-xl border border-gray-200 shadow-sm p-4 bg-gray-50'>
      <div className='flex items-center justify-between text-[12px] text-black/70 mb-2'>
        <span className='font-semibold text-black'>Your Progress</span>
        <span>
          3 <span className='text-black/40'>of</span> 6{' '}
          <span className='text-black/60'>Courses completed</span>
        </span>
      </div>
      <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
        <div
          className='h-full rounded-full'
          style={{ width: '50%', backgroundColor: '#2E7D32' }}
        />
      </div>
      <div className='mt-2 text-[11px] text-black/60'>50% complete</div>
    </div>
  );
};

const CourseCard = ({ course, onContinue }) => {
  const [expanded, setExpanded] = React.useState(false);
  const preview = course.description.slice(0, 115);

  return (
    <div className='bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden'>
      <div className='h-44 w-full bg-gray-200'>
        <img
          src={course.image}
          alt={course.title}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-5'>
        <h3 className='text-[18px] font-semibold text-[#1B4A7B] leading-6 mb-3'>
          {course.title}
        </h3>
        <p className='text-[12px] text-black/70 leading-6 mb-5'>
          {expanded ? course.description : `${preview}`}
          {!expanded && course.description.length > preview.length && (
            <>
              ...
              <button
                type='button'
                onClick={() => setExpanded(true)}
                className='text-[#1B4A7B] font-semibold hover:underline ml-1'
              >
                Sea More
              </button>
            </>
          )}
          {expanded && (
            <button
              type='button'
              onClick={() => setExpanded(false)}
              className='text-[#1B4A7B] font-semibold hover:underline ml-1'
            >
              Show Less
            </button>
          )}
        </p>
        <div className='flex items-center justify-between'>
          <span className='text-[11px] text-black/70'>
            {course.progressText}
          </span>
          <button
            type='button'
            onClick={() => onContinue(course.id)}
            className='text-[13px] text-blue-500 hover:text-blue-600 font-semibold hover:underline'
          >
            Continue >>
          </button>
        </div>
      </div>
    </div>
  );
};

const MyCoursesContent = () => {
  const navigate = useNavigate();

  const handleContinue = (courseId) => {
    const path = ROUTES.COURSE_DETAIL.replace(':id', String(courseId));
    navigate(path);
  };

  const handleExplore = () => {
    navigate(ROUTES.COURSES);
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-[20px] md:text-[22px] font-semibold text-black'>
        My Courses
      </h2>

      <ProgressCard />

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} onContinue={handleContinue} />
        ))}
      </div>

      <div className='flex justify-center pt-2'>
        <button
          type='button'
          onClick={handleExplore}
          className='px-6 py-3 rounded-xl border border-gray-300 bg-white shadow-sm text-sm text-black/80 hover:bg-gray-50 min-w-[250px]'
        >
          Explore More +
        </button>
      </div>
    </div>
  );
};

export default MyCoursesContent;
