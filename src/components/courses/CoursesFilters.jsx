import React, { useState, useMemo } from "react";
import { FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";

const CoursesFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedLevels,
  setSelectedLevels,
  selectedDurations,
  setSelectedDurations,
  onClearAll,
  filterCounts = { categories: {}, levels: {}, durations: {} },
  totalCourses = 0,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    levels: true,
    durations: true,
  });

  // Convert filterCounts to array format for rendering
  const categories = useMemo(() => {
    return Object.entries(filterCounts.categories).map(([name, count]) => ({
      name,
      count,
      checked: selectedCategories.includes(name),
    }));
  }, [filterCounts.categories, selectedCategories]);

  const levels = useMemo(() => {
    return Object.entries(filterCounts.levels).map(([name, count]) => ({
      name,
      count,
      checked: selectedLevels.includes(name),
    }));
  }, [filterCounts.levels, selectedLevels]);

  const durations = useMemo(() => {
    const durationOrder = ["0-3 Hours", "3-6 Hours", "6-12 Hours"];
    return durationOrder
      .filter((duration) => filterCounts.durations[duration] > 0)
      .map((name) => ({
        name,
        count: filterCounts.durations[name],
        checked: selectedDurations.includes(name),
      }));
  }, [filterCounts.durations, selectedDurations]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleLevelChange = (levelName) => {
    setSelectedLevels((prev) =>
      prev.includes(levelName)
        ? prev.filter((level) => level !== levelName)
        : [...prev, levelName]
    );
  };

  const handleDurationChange = (durationName) => {
    setSelectedDurations((prev) =>
      prev.includes(durationName)
        ? prev.filter((duration) => duration !== durationName)
        : [...prev, durationName]
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-black">Filters</h3>
          <p className="text-sm text-gray-600 mt-1">
            {totalCourses} courses available
          </p>
        </div>
        <button
          onClick={onClearAll}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("categories")}
          className="flex items-center justify-between w-full text-left font-medium text-black mb-4"
        >
          Categories
          {expandedSections.categories ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expandedSections.categories && (
          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category.name}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleCategoryChange(category.name)}
                    className="mr-3 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black/80">{category.name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  ({category.count})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Levels */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("levels")}
          className="flex items-center justify-between w-full text-left font-medium text-black mb-4"
        >
          Level
          {expandedSections.levels ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expandedSections.levels && (
          <div className="space-y-3">
            {levels.map((level) => (
              <label
                key={level.name}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(level.name)}
                    onChange={() => handleLevelChange(level.name)}
                    className="mr-3 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black/80">{level.name}</span>
                </div>
                <span className="text-xs text-gray-500">({level.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Duration */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("durations")}
          className="flex items-center justify-between w-full text-left font-medium text-black mb-4"
        >
          Duration
          {expandedSections.durations ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expandedSections.durations && (
          <div className="space-y-3">
            {durations.map((duration) => (
              <label
                key={duration.name}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedDurations.includes(duration.name)}
                    onChange={() => handleDurationChange(duration.name)}
                    className="mr-3 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black/80">{duration.name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  ({duration.count})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesFilters;
