import React, { useState } from "react";
import {
  FaFileAlt,
  FaDownload,
  FaEye,
  FaUsers,
  FaSearch,
  FaFilter,
  FaBookOpen,
} from "react-icons/fa";
import { jinnarCoursesData } from "../../data/jinnarCourses";

// Course categories with icons
const categories = [
  { id: "all", name: "All Resources", icon: FaBookOpen },
  { id: "business", name: "Business Skills", icon: FaUsers },
];

const JinnarCoursesContent = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [downloadingId, setDownloadingId] = useState(null);

  // Handle file download
  const handleDownload = async (course) => {
    if (!course.filePath) {
      alert("Download file not available for this course.");
      return;
    }

    setDownloadingId(course.id);
    try {
      const link = document.createElement("a");
      link.href = course.filePath;
      link.download = course.fileName || `${course.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Handle file preview
  const handlePreview = (course) => {
    if (!course.filePath) {
      alert("Preview not available for this course.");
      return;
    }
    window.open(course.filePath, "_blank");
  };

  // Filter and sort courses
  const filteredCourses = jinnarCoursesData
    .filter((course) => {
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });

  return (
    <section
      id="courses"
      className="bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-24"
    >
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Training Resources
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
            Browse Our <span className="text-primary">Resource Library</span>
          </h2>
          <p className="text-black/70 text-base sm:text-lg max-w-2xl mx-auto">
            Access free training documents across various trades and skills.
            Download PDFs, study guides, and certification materials.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <FaFilter className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white min-w-[160px]"
              >
                <option value="newest">Newest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <category.icon className="text-sm" />
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-black">
              {filteredCourses.length}
            </span>{" "}
            resources
            {selectedCategory !== "all" && (
              <span>
                {" "}
                in{" "}
                <span className="text-primary font-medium">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              </span>
            )}
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Course Thumbnail */}
                <div className="relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-40 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <button
                        onClick={() => handlePreview(course)}
                        className="flex-1 bg-white text-primary text-sm font-medium py-2 rounded-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => handleDownload(course)}
                        disabled={downloadingId === course.id}
                        className={`flex-1 bg-success text-white text-sm font-medium py-2 rounded-lg hover:bg-success/90 transition-all flex items-center justify-center gap-2 ${
                          downloadingId === course.id
                            ? "opacity-75 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <FaDownload
                          className={
                            downloadingId === course.id ? "animate-spin" : ""
                          }
                        />
                        <span>
                          {downloadingId === course.id
                            ? "Downloading..."
                            : "Download"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-4 sm:p-5">
                  {/* Category Tag */}
                  <div className="flex items-center gap-2 mb-3">
                    {React.createElement(
                      categories.find((c) => c.id === course.category)?.icon ||
                        FaFileAlt,
                      { className: "text-primary text-sm" }
                    )}
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      {categories.find((c) => c.id === course.category)?.name}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-semibold text-black mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Download Status */}
                  {course.filePath && (
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-success text-sm">
                        <FaDownload className="text-xs" />
                        <span>Ready to Download</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 sm:py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFileAlt className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredCourses.length > 0 && (
          <div className="text-center mt-10 sm:mt-14">
            <button className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300">
              Load More Resources
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default JinnarCoursesContent;
