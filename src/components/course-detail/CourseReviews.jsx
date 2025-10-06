import React, { useState, useEffect } from "react";
import { ReviewService, UserService } from "../../services";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl transition-colors ${
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } ${
            star <= (hoverRating || rating)
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => !readOnly && onRatingChange(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          disabled={readOnly}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const ReviewForm = ({ courseId, onReviewSubmitted, onCancel }) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please login to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters in your review");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await ReviewService.createReview({
        userId: currentUser.uid,
        courseId,
        rating,
        comment: comment.trim(),
      });

      if (result.success) {
        toast.success("Review submitted successfully!");
        setRating(0);
        setComment("");
        onReviewSubmitted();
      } else {
        toast.error(result.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this course..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={4}
            maxLength={1000}
          />
          <div className="text-sm text-gray-500 mt-1">
            {comment.length}/1000 characters
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const ReviewItem = ({ review }) => {
  const [expanded, setExpanded] = useState(false);

  const shouldShowExpand = review.comment && review.comment.length > 200;
  const displayComment = expanded
    ? review.comment
    : review.comment?.substring(0, 200);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-gray-600">
              {review.userDisplayName
                ? review.userDisplayName.charAt(0).toUpperCase()
                : "U"}
            </span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {review.userDisplayName || "Anonymous User"}
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} readOnly />
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-gray-700 mb-3">
          {displayComment}
          {shouldShowExpand && !expanded && "..."}
        </p>

        {shouldShowExpand && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary text-sm font-medium hover:underline"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
};

const CourseReviews = ({ courseId }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [
      { stars: 5, count: 0, percentage: "0%" },
      { stars: 4, count: 0, percentage: "0%" },
      { stars: 3, count: 0, percentage: "0%" },
      { stars: 2, count: 0, percentage: "0%" },
      { stars: 1, count: 0, percentage: "0%" },
    ],
  });

  const calculateReviewStats = (reviewsData) => {
    if (!reviewsData || reviewsData.length === 0) {
      setReviewStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [
          { stars: 5, count: 0, percentage: "0%" },
          { stars: 4, count: 0, percentage: "0%" },
          { stars: 3, count: 0, percentage: "0%" },
          { stars: 2, count: 0, percentage: "0%" },
          { stars: 1, count: 0, percentage: "0%" },
        ],
      });
      return;
    }

    const totalReviews = reviewsData.length;
    const totalRating = reviewsData.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / totalReviews;

    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const count = reviewsData.filter(
        (review) => review.rating === stars
      ).length;
      const percentage =
        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
      return { stars, count, percentage: `${percentage}%` };
    });

    setReviewStats({
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews,
      ratingDistribution: distribution,
    });
  };

  useEffect(() => {
    const fetchReviewsData = async () => {
      if (!courseId) return;

      try {
        setLoading(true);

        // Simple fetch without complex queries
        const result = await ReviewService.getCourseReviews(courseId);

        if (result.success && result.data && Array.isArray(result.data)) {
          // Process reviews with user data
          const reviewsWithUserData = await Promise.all(
            result.data.map(async (review) => {
              // Ensure review has required fields
              if (!review || !review.userId) {
                return null;
              }

              try {
                const userResult = await UserService.getUserById(review.userId);
                return {
                  ...review,
                  userDisplayName:
                    userResult.success && userResult.data?.displayName
                      ? userResult.data.displayName
                      : "Anonymous User",
                };
              } catch {
                return {
                  ...review,
                  userDisplayName: "Anonymous User",
                };
              }
            })
          );

          // Filter out null reviews and set state
          const validReviews = reviewsWithUserData.filter(
            (review) => review !== null
          );
          setReviews(validReviews);
          calculateReviewStats(validReviews);

          // Check if current user has already reviewed
          if (currentUser && validReviews.length > 0) {
            const existingReview = validReviews.find(
              (review) => review.userId === currentUser.uid
            );
            setUserReview(existingReview || null);
          }
        } else {
          setReviews([]);
          calculateReviewStats([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
        calculateReviewStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsData();
  }, [courseId, currentUser]);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    // Small delay to ensure the review is written to Firestore
    setTimeout(async () => {
      try {
        const result = await ReviewService.getCourseReviews(courseId);
        if (result.success) {
          const reviewsWithUserData = await Promise.all(
            result.data.map(async (review) => {
              try {
                const userResult = await UserService.getUserById(review.userId);
                return {
                  ...review,
                  userDisplayName: userResult.success
                    ? userResult.data?.displayName || "Anonymous User"
                    : "Anonymous User",
                };
              } catch {
                return {
                  ...review,
                  userDisplayName: "Anonymous User",
                };
              }
            })
          );
          setReviews(reviewsWithUserData);
          calculateReviewStats(reviewsWithUserData);

          if (currentUser) {
            const existingReview = reviewsWithUserData.find(
              (review) => review.userId === currentUser.uid
            );
            setUserReview(existingReview || null);
          }
        }
      } catch (error) {
        console.error("Error refreshing reviews:", error);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-gray-200 pb-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Student Reviews</h2>
        {isAuthenticated && !userReview && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Stats */}
      <div className="flex items-start mb-8">
        <div className="flex flex-col items-center mr-10">
          <div className="text-6xl font-bold">{reviewStats.averageRating}</div>
          <div className="flex items-center text-yellow-400 my-3">
            <StarRating
              rating={Math.round(reviewStats.averageRating)}
              readOnly
            />
          </div>
          <div className="text-sm text-gray-600">
            {reviewStats.totalReviews} review
            {reviewStats.totalReviews !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="flex-1">
          {reviewStats.ratingDistribution.map((rating) => (
            <div key={rating.stars} className="flex items-center mb-2">
              <div className="w-6 flex items-center text-yellow-400 text-sm">
                <span className="mr-1">★</span>
                {rating.stars}
              </div>
              <div className="flex-1 h-2 mx-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: rating.percentage }}
                ></div>
              </div>
              <span className="w-12 text-right text-sm">
                {rating.percentage}
              </span>
              <span className="w-8 text-right text-xs text-gray-500 ml-2">
                ({rating.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {isAuthenticated && userReview && (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800">
              Thank you for your review! You have already reviewed this course.
            </p>
          </div>
        </div>
      )}

      {showReviewForm && !userReview && (
        <ReviewForm
          courseId={courseId}
          onReviewSubmitted={handleReviewSubmitted}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {!isAuthenticated && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-gray-600">
            Please login to write a review for this course.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Showing {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No reviews yet.</p>
            <p className="text-gray-400">Be the first to review this course!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseReviews;
