import React from "react";
import { Button } from "../ui";
import { AboutHeroImg } from "../../assets";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-10 sm:py-14 md:py-16 lg:py-20 relative overflow-hidden">
      {/* Blue geometric background element - top right only */}
      <div className="absolute top-0 right-0 w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] lg:w-[400px] lg:h-[300px] bg-primary rounded-bl-3xl"></div>

      <div className="section-container relative z-10 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-20 xl:gap-32 justify-center items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left w-full lg:w-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-6 leading-tight text-black">
              Empowering Africa's Informal Workers
              <br />
              <span className="text-success">
                Through Free, High-Quality Training
              </span>
            </h1>

            <p className="text-base sm:text-lg text-black/80 mb-4 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Training.Jinnar is the official learning and certification
              platform of the Jinnar ecosystem. We are dedicated to giving
              Africa's informal sector workers—plumbers, welders, mechanics,
              tailors, cleaners, carpenters, electricians, painters, and
              more—the skills, confidence, and professionalism needed to succeed
              in today's market.
            </p>

            <div className="bg-success/10 border-l-4 border-success p-3 sm:p-4 rounded-r-lg mb-4 sm:mb-6 max-w-lg mx-auto lg:mx-0 text-left">
              <p className="text-base sm:text-lg font-semibold text-success mb-2">
                And the best part?
              </p>
              <p className="text-sm sm:text-base text-black font-medium">
                All training courses on Training.Jinnar are offered{" "}
                <span className="text-success font-bold">
                  100% Free of Charge
                </span>
                .
              </p>
              <p className="text-black/70 text-xs sm:text-sm mt-2">
                No fees. No hidden costs. No barriers.
              </p>
            </div>

            <p className="text-primary font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              We believe every worker deserves access to opportunity.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                text="Start Learning Free"
                className="btn-base-large bg-success text-white hover:bg-success/90 w-full sm:w-auto"
                icon="🎓"
                onClick={() => navigate(ROUTES.COURSES)}
              />
              <Button
                text="Contact Us"
                className="btn-base-large bg-primary text-white hover:bg-primary/90 w-full sm:w-auto"
                icon="👋"
                onClick={() => navigate(ROUTES.CONTACT)}
              />
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative flex items-center justify-center mt-6 lg:mt-0">
            <div className="relative z-20">
              <img
                src={AboutHeroImg}
                alt="African worker receiving training"
                className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
