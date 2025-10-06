import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiHeart, FiClock, FiStar, FiUsers } from "react-icons/fi";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { favoritesService } from "../../services";
import { Button } from "../ui";

const FavoriteCard = ({ course, onRemoveFavorite }) => {
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveFavorite = async () => {
    setIsRemoving(true);
    await onRemoveFavorite(course.id);
    setIsRemoving(false);
  };

  const handleViewCourse = () => {
    navigate(ROUTES.COURSE_DETAIL.replace(":id", course.id));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Course Image */}
      <div className="relative">
        <img
          src={course.thumbnail || course.image || "/placeholder-course.jpg"}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleRemoveFavorite}
          disabled={isRemoving}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white group disabled:opacity-50"
        >
          <FiHeart className="w-5 h-5 text-red-500 fill-current group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
            {course.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description ||
            course.detailedDescription ||
            "No description available"}
        </p>

        {/* Course Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            <span>{course.duration || "0 Hours"}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiUsers className="w-4 h-4" />
            <span>
              {course.totalEnrollments || course.enrolled || 0} enrolled
            </span>
          </div>
          {course.rating > 0 && (
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Course Category & Level */}
        <div className="flex items-center gap-2 mb-4">
          {course.category && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {course.category}
            </span>
          )}
          {course.level && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {course.level}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleViewCourse}
            className="flex-1 btn-base-medium btn-primary text-white"
          >
            View Course
          </button>
          <button
            onClick={handleRemoveFavorite}
            disabled={isRemoving}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
};

const FavoritesContent = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const result = await favoritesService.getFavoriteCoursesWithDetails(
        currentUser.uid
      );

      if (result.success) {
        setFavorites(result.data || []);
      } else {
        toast.error("Failed to load favorite courses");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("An error occurred while loading favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentUser]);

  const handleRemoveFavorite = async (courseId) => {
    try {
      const result = await favoritesService.removeFromFavorites(
        currentUser.uid,
        courseId
      );

      if (result.success) {
        setFavorites((prev) => prev.filter((course) => course.id !== courseId));
        toast.success("Course removed from favorites!");
      } else {
        toast.error("Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("An error occurred while removing favorite");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Sign in to view favorites
        </h3>
        <p className="text-gray-600 mb-6">
          Please sign in to see your favorite courses.
        </p>
        <Button href={ROUTES.LOGIN} className="btn-primary">
          Sign In
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse"
          >
            <div className="w-full h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
                <div className="h-10 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No favorites yet
        </h3>
        <p className="text-gray-600 mb-6">
          Start exploring courses and add them to your favorites to see them
          here.
        </p>
        <Button href={ROUTES.COURSES} className="btn-primary">
          Browse Courses
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          My Favorite Courses
        </h2>
        <p className="text-gray-600">
          {favorites.length} course{favorites.length !== 1 ? "s" : ""} in your
          favorites
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((course) => (
          <FavoriteCard
            key={course.id}
            course={course}
            onRemoveFavorite={handleRemoveFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesContent;
