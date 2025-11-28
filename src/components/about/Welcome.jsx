import React from "react";
import { Professor2 } from "../../assets";

const Welcome = () => {
  return (
    <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-gray-50">
      <div className="section-container px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 md:gap-12 mx-auto justify-center">
          {/* Left Side - Profile Image */}
          <div className="flex justify-center items-center order-2 lg:order-0">
            <div className="relative">
              <img
                src={Professor2}
                alt="African worker training"
                className="max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[450px] object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="w-full lg:max-w-[50%] text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6 leading-tight max-w-[420px] mx-auto lg:mx-0">
              Welcome to Training.Jinnar
            </h2>

            <div className="space-y-3 sm:space-y-4 text-black/70 leading-relaxed">
              <p className="font-bold text-base sm:text-lg text-success mb-3 sm:mb-4">
                Skills rise. Opportunities grow.
                <br />
                Futures transform.
              </p>

              <p className="text-sm sm:text-base text-black">
                At{" "}
                <span className="text-success font-medium">
                  Training.Jinnar
                </span>
                , we believe that every worker in Africa deserves the chance to
                grow, succeed, and be recognized for their expertise. That's why
                we've created a platform dedicated entirely to Africa's informal
                sector workers.
              </p>

              <p className="text-sm sm:text-base text-black">
                Whether you're a plumber, welder, mechanic, tailor, cleaner,
                carpenter, electrician, or painter—this platform was built for{" "}
                <span className="font-semibold">you</span>. Our courses are
                designed to improve your professionalism, increase your income,
                and build trust between you and your customers.
              </p>

              <p className="text-sm sm:text-base text-black">
                Here, you're not just taking a course.
                <br />
                <span className="font-semibold text-primary">
                  You're joining a movement to build Africa's trusted workforce.
                </span>
              </p>

              <div className="bg-success/10 border-l-4 border-success p-3 sm:p-4 rounded-r-lg mt-4 sm:mt-6 text-left">
                <p className="text-success font-bold text-base sm:text-lg">
                  100% Free. Forever.
                </p>
                <p className="text-black/70 text-xs sm:text-sm">
                  Because we believe every worker deserves access to
                  opportunity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
