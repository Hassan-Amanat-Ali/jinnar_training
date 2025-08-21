import React from 'react';
import { Hero, Services, Goals, About, Testimonials } from '../components/home';

const Home = () => {
  return (
    <div>
      <Hero />
      <Services />
      <Goals />
      <About />
      <Testimonials />
    </div>
  );
};

export default Home;
