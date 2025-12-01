import React from "react";
import {
  FaFileAlt,
  FaFilePdf,
  FaDownload,
  FaCertificate,
  FaCheckCircle,
  FaGlobeAfrica,
  FaUserGraduate,
} from "react-icons/fa";

const JinnarCoursesFeatures = () => {
  const features = [
    {
      icon: FaFilePdf,
      title: "PDF Documents",
      description:
        "High-quality training materials in easy-to-read PDF format, accessible offline anytime.",
      color: "bg-red-50 text-red-500",
    },
    {
      icon: FaDownload,
      title: "Free Downloads",
      description:
        "All resources are completely free. Download, print, and share with your community.",
      color: "bg-success/10 text-success",
    },
    {
      icon: FaCertificate,
      title: "Certification Ready",
      description:
        "Study materials aligned with industry standards to help you earn professional certifications.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: FaGlobeAfrica,
      title: "African Context",
      description:
        "Content tailored for Africa's informal sector, addressing local challenges and opportunities.",
      color: "bg-orange-50 text-orange-500",
    },
    {
      icon: FaUserGraduate,
      title: "Self-Paced Learning",
      description:
        "Learn at your own speed. No deadlines, no pressure—just quality education on your terms.",
      color: "bg-purple-50 text-purple-500",
    },
    {
      icon: FaCheckCircle,
      title: "Practical Skills",
      description:
        "Focus on hands-on, practical skills that you can immediately apply in your work.",
      color: "bg-teal-50 text-teal-500",
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block bg-success/10 text-success px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Why Choose Jinnar Training
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
            Resources Designed for{" "}
            <span className="text-primary">Your Success</span>
          </h2>
          <p className="text-black/70 text-base sm:text-lg max-w-2xl mx-auto">
            Our training materials are crafted with Africa's informal workers in
            mind, providing practical, accessible, and industry-relevant
            content.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 sm:p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl border border-transparent hover:border-gray-100 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="text-2xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 sm:mt-20 bg-gradient-to-r from-primary to-primary/90 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -translate-x-1/3 translate-y-1/3"></div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <FaFileAlt className="text-white text-sm" />
              <span className="text-white text-sm font-medium">
                Start Learning Today
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Upgrade Your Skills?
            </h3>
            <p className="text-white/90 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Join thousands of African workers who are building better futures
              through free professional training.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#courses"
                className="bg-success hover:bg-success/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse All Resources
              </a>
              <a
                href="/faq"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 border border-white/30"
              >
                View FAQs
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JinnarCoursesFeatures;
