import React, { useState, useEffect } from "react";
import { CourseService } from "../../services";

// Helper functions outside component to avoid dependency issues
const parseDuration = (duration) => {
  if (!duration) return 0;

  // Parse duration in format "HH:MM" or "MM:SS" to total minutes
  const parts = duration.split(":");
  if (parts.length === 2) {
    const first = parseInt(parts[0]) || 0;
    const second = parseInt(parts[1]) || 0;

    // Assume if first part > 5, it's minutes:seconds, otherwise hours:minutes
    if (first > 5) {
      return first + second / 60; // minutes + seconds as fraction
    } else {
      return first * 60 + second; // hours * 60 + minutes
    }
  }
  return 0;
};

const formatDuration = (totalMinutes) => {
  if (totalMinutes < 60) {
    return `${Math.round(totalMinutes)}min`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
};

const CourseContent = ({ courseId }) => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState([]);
  const [expandAll, setExpandAll] = useState(false);

  // Generate URL for learning point click
  const getLearningPointUrl = (lecture, point) => {
    if (typeof point === "object" && point.timestamp) {
      return `/courses/${courseId}/watch/${lecture.id}?t=${point.timestamp}`;
    } else {
      return `/courses/${courseId}/watch/${lecture.id}`;
    }
  };

  useEffect(() => {
    const fetchLectures = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await CourseService.getCourseLectures(courseId);

        if (result.success && result.data) {
          setLectures(result.data);
          setExpandedSections(new Array(result.data.length).fill(false));
        } else {
          setLectures([]);
        }
      } catch (error) {
        console.error("Error fetching lectures:", error);
        setLectures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [courseId]);

  const toggleSection = (index) => {
    const updatedSections = [...expandedSections];
    updatedSections[index] = !updatedSections[index];
    setExpandedSections(updatedSections);
  };

  const handleExpandAll = () => {
    setExpandAll(!expandAll);
    setExpandedSections(lectures.map(() => !expandAll));
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-100 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-md p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!lectures || lectures.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold mb-6">Course content</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No lectures available for this course yet.</p>
          <p className="text-sm">Content will be added soon.</p>
        </div>
      </div>
    );
  }

  const totalLearningPoints = lectures.reduce(
    (total, lecture) => total + (lecture.learningPoints?.length || 0),
    0
  );
  const totalDuration = formatDuration(
    lectures.reduce(
      (total, lecture) => total + parseDuration(lecture.duration),
      0
    )
  );

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course content</h2>
        <button className="text-primary font-medium" onClick={handleExpandAll}>
          {expandAll ? "Collapse all sections" : "Expand all sections"}
        </button>
      </div>
      <div className="text-sm text-gray-600 mb-6">
        {lectures.length} lectures • {totalLearningPoints} learning points •
        Total length: {totalDuration}
      </div>

      <div className="space-y-4">
        {lectures.map((lecture, i) => (
          <div
            key={lecture.id || i}
            className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div
              className="bg-gray-50/50 p-4 flex justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              onClick={() => toggleSection(i)}
            >
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-3 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d={
                      expandedSections[i]
                        ? "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        : "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    }
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-gray-800">
                  {lecture.title}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {lecture.learningPoints?.length || 0} learning points •{" "}
                {lecture.duration || "0:00"}
              </div>
            </div>

            {expandedSections[i] &&
              lecture.learningPoints &&
              lecture.learningPoints.length > 0 && (
                <div className="border-t border-gray-100 bg-white">
                  <ul className="divide-y divide-gray-50">
                    {lecture.learningPoints.map((point, j) => (
                      <li key={j}>
                        <a
                          href={getLearningPointUrl(lecture, point)}
                          className="p-4 flex items-center hover:bg-emerald-50/50 transition-colors duration-150 cursor-pointer group"
                        >
                          <svg
                            className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 group-hover:text-emerald-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 group-hover:text-gray-900">
                                {typeof point === "string" ? point : point.text}
                              </span>
                              {typeof point === "object" && point.timestamp && (
                                <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded font-medium group-hover:bg-emerald-200 flex items-center gap-1">
                                  <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M8 5v10l8-5z" />
                                  </svg>
                                  {point.timestamp}
                                </span>
                              )}
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;
