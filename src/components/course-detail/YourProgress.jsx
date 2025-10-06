import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { EnrollmentService, LectureProgressService } from "../../services";
import { LoadingSpinner } from "../common";

const YourProgress = ({ courseId }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isAuthenticated || !currentUser || !courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get enrollment with detailed progress
        const enrollmentResult =
          await EnrollmentService.getEnrollmentWithProgress(
            currentUser.uid,
            courseId
          );

        if (enrollmentResult.success) {
          setProgressData(enrollmentResult.data);
        } else {
          // User might not be enrolled
          setProgressData(null);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Failed to load progress data");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [currentUser, isAuthenticated, courseId]);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Don't show component if user is not enrolled
  if (!progressData) {
    return null;
  }

  const { progressDetails = {}, lastAccessedAt } = progressData;

  const {
    overallProgress = 0,
    completedLectures = 0,
    totalLectures = 0,
    detailedProgress = [],
  } = progressDetails;

  const clampedPercent = Math.max(0, Math.min(100, overallProgress));

  // Calculate time-based statistics
  const totalWatchTime = detailedProgress.reduce((total, lecture) => {
    return total + (lecture.currentPosition || 0);
  }, 0);

  const formatWatchTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatLastAccessed = (timestamp) => {
    if (!timestamp) return "Never";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Your Progress</h2>
        <span className="text-sm text-gray-700">
          {completedLectures} of {totalLectures} lessons completed
        </span>
      </div>

      {/* Main Progress Bar */}
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-success rounded-full transition-all duration-300"
          style={{ width: `${clampedPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-700">{clampedPercent}% complete</p>
        <p className="text-xs text-gray-500">
          Last accessed: {formatLastAccessed(lastAccessedAt)}
        </p>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {formatWatchTime(totalWatchTime)}
          </div>
          <div className="text-xs text-gray-500">Total Watch Time</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {completedLectures}/{totalLectures}
          </div>
          <div className="text-xs text-gray-500">Lessons Completed</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {totalLectures > 0
              ? Math.round((completedLectures / totalLectures) * 100)
              : 0}
            %
          </div>
          <div className="text-xs text-gray-500">Course Progress</div>
        </div>
      </div>

      {/* Progress by Lecture (Optional - show if there are few lectures) */}
      {totalLectures <= 10 && detailedProgress.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Lecture Progress
          </h3>
          <div className="space-y-2">
            {detailedProgress.map((lecture, index) => (
              <div
                key={lecture.lectureId || index}
                className="flex items-center justify-between py-1"
              >
                <span className="text-xs text-gray-600">
                  Lecture {index + 1}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        lecture.completed ? "bg-green-500" : "bg-blue-400"
                      }`}
                      style={{ width: `${lecture.completionPercentage || 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">
                    {Math.round(lecture.completionPercentage || 0)}%
                  </span>
                  {lecture.completed && (
                    <span className="text-green-500 text-xs">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YourProgress;
