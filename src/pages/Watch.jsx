import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Header, Footer } from "../components/layout";
import VideoPlayer from "../components/video/VideoPlayer";
import VideoProgressTracker from "../components/video/VideoProgressTracker";
import Playlist from "../components/video/Playlist";
import { CourseService, EnrollmentService } from "../services";
import { useAuth } from "../hooks/useAuth";

const Watch = () => {
  const { id, lectureId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [lectures, setLectures] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentId, setCurrentId] = React.useState(lectureId);
  const videoRef = React.useRef(null);
  const timestamp = searchParams.get("t"); // Get timestamp from URL params

  // Memoize current lecture and navigation state to prevent unnecessary re-renders
  const currentLecture = React.useMemo(() => {
    if (!lectures.length || !currentId) return null;
    const index = lectures.findIndex((l) => l.id === currentId);
    return lectures[index] || lectures[0];
  }, [lectures, currentId]);

  const navigationState = React.useMemo(() => {
    if (!lectures.length || !currentId)
      return { canPrev: false, canNext: false, index: -1 };
    const index = lectures.findIndex((l) => l.id === currentId);
    return {
      index,
      canPrev: index > 0,
      canNext: index < lectures.length - 1,
    };
  }, [lectures, currentId]);

  // Fetch real lecture data from database (only when courseId changes)
  React.useEffect(() => {
    const fetchLectures = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const result = await CourseService.getCourseLectures(id);

        if (result.success && result.data) {
          const lectureData = result.data.map((lecture) => ({
            id: lecture.id,
            title: lecture.title,
            subtitle: lecture.subtitle || lecture.title,
            src: lecture.videoUrl,
            thumb: lecture.thumbnail,
            duration: lecture.duration,
            order: lecture.order,
          }));

          setLectures(lectureData);
        }
      } catch (error) {
        console.error("Error fetching lectures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [id]); // Only depend on courseId, not lectureId

  // Handle lecture selection separately
  React.useEffect(() => {
    if (lectures.length > 0) {
      if (lectureId) {
        // Check if the lectureId exists in our data
        const lectureExists = lectures.find((l) => l.id === lectureId);
        if (lectureExists) {
          setCurrentId(lectureId);
        } else {
          // Fallback to first lecture if lectureId doesn't exist
          setCurrentId(lectures[0].id);
          navigate(`/courses/${id}/watch/${lectures[0].id}`, { replace: true });
        }
      } else {
        // No lectureId provided, default to first lecture
        setCurrentId(lectures[0].id);
        navigate(`/courses/${id}/watch/${lectures[0].id}`, { replace: true });
      }
    }
  }, [lectures, lectureId, id, navigate]);

  // Handle progress updates from video tracker
  const handleProgressUpdate = React.useCallback(
    async (progressUpdate) => {
      console.log("Progress update:", progressUpdate);

      // Update enrollment progress when lecture is completed
      if (progressUpdate.completed && currentUser) {
        try {
          await EnrollmentService.updateEnrollmentProgress(currentUser.uid, id);
        } catch (error) {
          console.error("Error updating enrollment progress:", error);
        }
      }
    },
    [currentUser, id]
  );

  // Memoize navigation handlers to prevent re-creating on every render
  const goTo = React.useCallback(
    (idx) => {
      const safe = Math.max(0, Math.min(lectures.length - 1, idx));
      const next = lectures[safe];
      setCurrentId(next.id);
      // Use replace to avoid adding to browser history for smoother experience
      navigate(`/courses/${id}/watch/${next.id}`, { replace: true });
    },
    [lectures, id, navigate]
  );

  const handleSelect = React.useCallback(
    (nextId) => {
      const idx = lectures.findIndex((l) => l.id === nextId);
      goTo(idx);
    },
    [lectures, goTo]
  );

  const handlePrev = React.useCallback(
    () => goTo(navigationState.index - 1),
    [goTo, navigationState.index]
  );
  const handleNext = React.useCallback(
    () => goTo(navigationState.index + 1),
    [goTo, navigationState.index]
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Header />
        <main className="section-container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-200 rounded-2xl h-[58vh] md:h-[70vh] animate-pulse"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // No lectures available
  if (!lectures || lectures.length === 0) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Header />
        <main className="section-container py-6">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">No lectures available</h2>
            <p className="text-gray-600">
              This course doesn't have any lectures yet.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Don't render if we don't have a current lecture
  if (!currentLecture) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Header />
        <main className="section-container py-6">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Loading lecture...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Disable right-click context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="min-h-screen bg-white text-black"
      onContextMenu={handleContextMenu}
    >
      <Header />
      <main className="section-container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideoPlayer
              src={currentLecture.src}
              poster={currentLecture.thumb}
              title={currentLecture.subtitle || currentLecture.title}
              startTime={timestamp} // Pass timestamp for seeking
              onPrev={navigationState.canPrev ? handlePrev : undefined}
              onNext={navigationState.canNext ? handleNext : undefined}
              canPrev={navigationState.canPrev}
              canNext={navigationState.canNext}
            />

            {/* Video Progress Tracker - will find video element in DOM */}
            {isAuthenticated && currentUser && currentLecture && (
              <VideoProgressTracker
                userId={currentUser.uid}
                courseId={id}
                lectureId={currentId}
                videoRef={videoRef}
                videoDuration={
                  currentLecture?.duration
                    ? parseFloat(currentLecture.duration) * 60
                    : undefined
                }
                onProgressUpdate={handleProgressUpdate}
              />
            )}
          </div>
          <div className="lg:col-span-1">
            <Playlist
              items={lectures}
              currentId={currentId}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Watch;
