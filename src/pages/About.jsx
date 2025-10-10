import React from "react";
import { Hero, Skills, Impact, Professors, Welcome } from "../components/about";

const About = () => {
  return (
    <div>
      <Hero />
      <Skills />
      <Impact />
      {/* <Professors /> */}
      <Welcome />
    </div>
  );
};

export default About;
