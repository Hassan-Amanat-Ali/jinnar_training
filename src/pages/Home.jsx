import React from 'react';
import {
  Hero,
  CoursesShowcase,
  Goals,
  About,
  Testimonials,
} from '../components/home';

const Home = () => {
  return (
    <div>
      <Hero />
      <CoursesShowcase />
      <About />
      <Goals />
      <Testimonials />
    </div>
  );
};

export default Home;
