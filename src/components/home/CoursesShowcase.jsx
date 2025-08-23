import React, { useState } from 'react';
import { Card, Button } from '../ui';
import { courses, categories } from '../../data/courses';
import { FaArrowRight } from 'react-icons/fa';

const CoursesShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCourses =
    activeCategory === 'All'
      ? courses
      : courses.filter((course) => course.category === activeCategory);

  return (
    <section className='py-20 bg-secondary/10'>
      <div className='section-container'>
        <div className='text-center mb-16'>
          <h2 className='section-title'>Our Courses</h2>
          <p className='text-lg text-black max-w-3xl mx-auto'>
            All courses are professionally produced and reviewed by our internal
            team to ensure the highest quality learning experience.
          </p>
        </div>

        {/* Course Categories Filter */}
        <div className='flex flex-wrap justify-center gap-4 mb-12'>
          <button
            key='All'
            onClick={() => setActiveCategory('All')}
            className={`px-6 py-3 font-medium transition-all duration-200 cursor-pointer ${
              'All' === activeCategory
                ? 'bg-success text-white'
                : 'bg-gray-100 text-black/50 hover:bg-success/10'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`px-6 py-3 font-medium transition-all duration-200 cursor-pointer ${
                category.name === activeCategory
                  ? 'bg-success text-white'
                  : 'bg-gray-100 text-black/50 hover:bg-success/10'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className='flex flex-wrap gap-8 mb-12 items-center justify-center'>
          {filteredCourses.map((course) => {
            const actionButtons = (
              <>
                <Button
                  text='Enroll Now'
                  className='btn-base-medium btn-primary flex-1'
                />
                <Button
                  text='View Details'
                  className='btn-base-medium btn-outline flex-1'
                />
              </>
            );

            return (
              <Card
                key={course.id}
                image={course.image}
                title={course.title}
                description={course.description}
                duration={course.duration}
                students={course.enrolled.toLocaleString()}
                actionButtons={actionButtons}
                className='hover:shadow-xl transition-all duration-300 max-w-[350px] lg:max-w-[420px]'
              />
            );
          })}
        </div>

        {/* View All Courses CTA */}
        <div className='text-center'>
          <Button
            text='View All Courses'
            icon={<FaArrowRight className='text-white w-4 h-4' />}
            className='btn-base-large btn-primary mx-auto'
          />
        </div>
      </div>
    </section>
  );
};

export default CoursesShowcase;
