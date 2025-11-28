import React from "react";
import { AboutSkillsImg } from "../../assets";
import {
  FaGraduationCap,
  FaTools,
  FaShieldAlt,
  FaChartLine,
  FaCertificate,
  FaCheckCircle,
  FaMobileAlt,
  FaBookOpen,
  FaClipboardCheck,
  FaQuestionCircle,
  FaTrophy,
} from "react-icons/fa";

const Skills = () => {
  const modules = [
    { number: 1, title: "Professionalism" },
    { number: 2, title: "Communication" },
    { number: 3, title: "Timeliness" },
    { number: 4, title: "Quality of Work" },
    { number: 5, title: "Respect" },
    { number: 6, title: "Problem Solving" },
    { number: 7, title: "Efficiency" },
    { number: 8, title: "Tool Preparedness" },
    { number: 9, title: "Cleanliness & Safety" },
  ];

  const moduleIncludes = [
    { icon: FaBookOpen, text: "Real-life examples" },
    { icon: FaShieldAlt, text: "Mistakes to avoid" },
    { icon: FaClipboardCheck, text: "Short lessons" },
    { icon: FaTools, text: "Practice simulations" },
    { icon: FaQuestionCircle, text: "20–50 quiz questions" },
    { icon: FaTrophy, text: "A final certification exam" },
  ];

  const weProvide = [
    { icon: FaGraduationCap, text: "Free professional training" },
    { icon: FaTools, text: "Practical job simulations" },
    { icon: FaShieldAlt, text: "Safety and communication guidance" },
    { icon: FaChartLine, text: "Business and financial literacy" },
    { icon: FaCertificate, text: "9-Module Worker Excellence Certification" },
    {
      icon: FaCheckCircle,
      text: "Verified certificates recognized on the Jinnar marketplace",
    },
  ];

  return (
    <>
      {/* Mission Banner */}
      <div className="w-full bg-dark-green py-4 sm:py-6">
        <div className="section-container px-4 sm:px-6">
          <h3 className="text-center text-white font-bold text-lg sm:text-xl mb-2">
            Our Mission
          </h3>
          <p className="text-center text-white/90 text-sm sm:text-base max-w-4xl mx-auto px-2">
            To uplift and empower Africa's informal workforce with free,
            accessible, and practical training that improves professionalism,
            increases income, and builds trust between workers and customers.
          </p>
        </div>
      </div>

      {/* Why This Matters Section */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-gray-50">
        <div className="section-container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-4 sm:mb-6 leading-tight">
              Why This Matters
            </h2>
            <p className="text-sm sm:text-base text-black/70 max-w-3xl mx-auto leading-relaxed mb-3 sm:mb-4 px-2">
              Millions of workers across Africa have skills—but lack access to
              training, digital tools, and certification. This prevents them
              from earning more, building trust, and expanding their careers.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-primary font-semibold">
              Training.Jinnar was created to close that gap.
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Image */}
              <div className="lg:w-1/2">
                <div className="relative overflow-hidden h-full">
                  <img
                    src={AboutSkillsImg}
                    alt="African workers in training"
                    className="w-full h-full object-cover min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[500px]"
                  />
                </div>
              </div>

              {/* Right Side - What We Provide */}
              <div className="lg:w-1/2 p-5 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-black mb-4 sm:mb-6 leading-tight">
                  We provide workers with:
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {weProvide.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start sm:items-center gap-3 sm:gap-4"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                      </div>
                      <span className="text-black/80 text-sm sm:text-base">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 sm:mt-8 bg-primary/10 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start sm:items-center gap-3">
                  <FaMobileAlt className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
                  <p className="text-black/70 text-sm sm:text-base">
                    Our courses are simple, clear, mobile-friendly, and designed
                    for workers of all education levels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Will Learn Section */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-white">
        <div className="section-container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-4 sm:mb-6">
              What You Will Learn
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-black/70 max-w-2xl mx-auto px-2">
              Our training covers everything a worker needs to succeed
            </p>
          </div>

          {/* 9 Core Modules Grid */}
          <div className="mb-10 sm:mb-12 md:mb-16">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-primary mb-6 sm:mb-8">
              9 Core Professional Modules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {modules.map((module) => (
                <div
                  key={module.number}
                  className="bg-gray-50 hover:bg-primary hover:text-white transition-colors rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 group"
                >
                  <span className="w-7 h-7 sm:w-8 sm:h-8 bg-success text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                    {module.number}
                  </span>
                  <span className="font-medium text-sm sm:text-base text-black group-hover:text-white">
                    {module.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Each Module Includes */}
          <div className="bg-success/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-12 max-w-5xl mx-auto">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-black mb-6 sm:mb-8">
              Each module includes:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {moduleIncludes.map((item, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-success flex-shrink-0" />
                  <span className="text-black/80 text-sm sm:text-base">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Certificate Highlight */}
            <div className="mt-6 sm:mt-8 md:mt-10 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-success">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaCertificate className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-success" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg md:text-xl font-bold text-black mb-1 sm:mb-2">
                    Jinnar Worker Excellence Certificate
                  </h4>
                  <p className="text-black/70 text-sm sm:text-base">
                    Workers who complete all modules are awarded this badge of
                    trust that appears on their profile inside the Jinnar
                    marketplace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Skills;
