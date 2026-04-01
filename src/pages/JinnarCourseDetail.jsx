import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaDownload, FaEye, FaClock, FaSignal } from "react-icons/fa";
import { Layout } from "../components/layout";
import { ROUTES } from "../constants/routes";
import { jinnarCoursesData } from "../data/jinnarCourses";
import courseDetails from "../data/jinnarCourseDetails.json";

const JinnarCourseDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const course = jinnarCoursesData.find((item) => item.slug === slug);
  const detail = courseDetails.find((item) => item.slug === slug);

  if (!course) {
    return (
      <Layout>
        <main className="min-h-screen bg-gray-50 py-16">
          <section className="section-container">
            <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center">
              <h1 className="text-2xl font-bold text-black mb-3">Course not found</h1>
              <p className="text-gray-600 mb-6">
                This resource link is invalid or the course was moved.
              </p>
              <button
                onClick={() => navigate(ROUTES.JINNAR_COURSES)}
                className="btn-base-medium btn-primary"
              >
                Back to Jinnar Courses
              </button>
            </div>
          </section>
        </main>
      </Layout>
    );
  }

  const handleView = () => {
    if (course.filePath) {
      window.open(course.filePath, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = () => {
    if (!course.filePath) {
      return;
    }

    const link = document.createElement("a");
    link.href = course.filePath;
    link.download = course.fileName || `${course.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <section className="section-container">
          <button
            onClick={() => navigate(ROUTES.JINNAR_COURSES)}
            className="inline-flex items-center gap-2 text-primary font-medium hover:opacity-80 transition-opacity mb-6"
          >
            <FaArrowLeft className="text-sm" />
            Back to Library
          </button>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid lg:grid-cols-2 gap-0">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-64 sm:h-72 lg:h-full w-full object-cover"
              />

              <div className="p-6 sm:p-8 lg:p-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-4">
                  Course Detail
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-black mb-4 leading-tight">
                  {detail?.heading || course.title}
                </h1>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {detail?.summary || course.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Duration</p>
                    <p className="font-semibold text-black inline-flex items-center gap-2">
                      <FaClock className="text-primary" />
                      {detail?.duration || "Self-paced"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Level</p>
                    <p className="font-semibold text-black inline-flex items-center gap-2">
                      <FaSignal className="text-primary" />
                      {detail?.level || "General"}
                    </p>
                  </div>
                </div>

                {detail?.audience && (
                  <div className="mb-8 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Best for</p>
                    <p className="text-gray-700 font-medium">{detail.audience}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleView}
                    className="btn-base-medium btn-primary flex-1"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FaEye />
                      View Document
                    </span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn-base-medium bg-success text-white hover:bg-success/90 flex-1"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FaDownload />
                      Download
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-black mb-4">What you will learn</h2>
              <ul className="space-y-3">
                {(detail?.whatYouLearn || []).map((item) => (
                  <li key={item} className="text-gray-700 flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-black mb-4">Highlights</h2>
              <ul className="space-y-3">
                {(detail?.highlights || []).map((item) => (
                  <li key={item} className="text-gray-700 flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-success flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {detail?.sections?.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 mt-6">
              <h2 className="text-xl font-bold text-black mb-4">Course sections</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {detail.sections.map((item) => (
                  <div key={item} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {detail?.faq?.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 mt-6 mb-2">
              <h2 className="text-xl font-bold text-black mb-4">Frequently asked questions</h2>
              <div className="space-y-3">
                {detail.faq.map((item) => (
                  <div key={item.question} className="rounded-xl border border-gray-100 p-4">
                    <h3 className="font-semibold text-black mb-1">{item.question}</h3>
                    <p className="text-gray-700 text-sm">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
};

export default JinnarCourseDetail;


