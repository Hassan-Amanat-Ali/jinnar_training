import React from "react";
import {
  FaCheckCircle,
  FaUserTie,
  FaDollarSign,
  FaHandshake,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

const Impact = () => {
  const workerBenefits = [
    { icon: FaChartLine, label: "Better Skills" },
    { icon: FaDollarSign, label: "Higher Income" },
    { icon: FaHandshake, label: "Improved Trust" },
    { icon: FaUsers, label: "Repeat Customers" },
    { icon: FaUserTie, label: "Career Growth" },
  ];

  const customerBenefits = [
    "More reliable workers",
    "Higher-quality service",
    "Safer, smoother experiences",
  ];

  const africanCountries = [
    "Tanzania",
    "Kenya",
    "Uganda",
    "Rwanda",
    "Malawi",
    "Zambia",
    "Zimbabwe",
    "Ghana",
    "Nigeria",
    "South Africa",
    "Namibia",
    "Ethiopia",
    "Eritrea",
    "DRC",
  ];

  return (
    <>
      {/* Our Commitment Section */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-primary">
        <div className="section-container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 sm:mb-6">
              Our Commitment
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white font-medium mb-3 sm:mb-4 px-2">
              We promise to keep all core training{" "}
              <span className="text-success">free forever</span>.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Our goal is not profit—it's empowerment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-5xl mx-auto">
            {/* Workers Gain */}
            <div className="bg-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                Workers Gain
              </h3>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                {workerBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 sm:gap-3 text-white"
                  >
                    <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-success flex-shrink-0" />
                    <span className="text-sm sm:text-base md:text-lg">
                      {benefit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customers Gain */}
            <div className="bg-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                Customers Gain
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {customerBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 sm:gap-3 text-white"
                  >
                    <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success flex-shrink-0" />
                    <span className="text-sm sm:text-base md:text-lg">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-lg sm:text-xl md:text-2xl font-bold text-success mt-8 sm:mt-10 md:mt-12">
            Everyone wins.
          </p>
        </div>
      </section>

      {/* Designed for All of Africa */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-gray-50">
        <div className="section-container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black mb-4 sm:mb-6">
              Designed for All of Africa
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed px-2">
              Training.Jinnar serves workers across the entire continent
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto mb-6 sm:mb-8">
            {africanCountries.map((country, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-primary hover:text-white transition-colors"
              >
                {country}
              </span>
            ))}
            <span className="bg-success/10 text-success px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
              And the rest of the continent
            </span>
          </div>

          <p className="text-center text-base sm:text-lg md:text-xl text-primary font-semibold px-2">
            Wherever you are in Africa, this platform is built for you.
          </p>
        </div>
      </section>

      {/* Building Africa's Trusted Workforce */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-success">
        <div className="section-container px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 sm:mb-6">
            Building Africa's Trusted Workforce
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
            Training.Jinnar is more than a learning hub— It is a movement to
            raise standards, build confidence, and help workers thrive in the
            digital economy.
          </p>
          <div className="bg-white/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl md:text-2xl text-white font-medium mb-3 sm:mb-4">
              Skills rise. Opportunities grow. Futures transform.
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              And all of it—<span className="text-primary">FREE OF CHARGE</span>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Impact;
