import React, { useState } from "react";

const Description = ({ description }) => {
  const [expanded, setExpanded] = useState(false);

  // Handle both string and object descriptions
  const getDescriptionText = () => {
    if (typeof description === "string") {
      return description;
    } else if (description && typeof description === "object") {
      return (
        description.intro || description.mainText || description.highlight || ""
      );
    }
    return "";
  };

  const fullDescription = getDescriptionText();
  const words = fullDescription.split(" ");
  const previewWords = words.slice(0, 30); // Show first 30 words
  const hasMoreContent = words.length > 30;

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-100 mb-8">
      <h2 className="text-2xl font-bold mb-6">Description</h2>
      <div className="prose max-w-none">
        {expanded ? (
          <div>
            <p className="mb-4 text-gray-700 leading-relaxed whitespace-pre-line">
              {fullDescription}
            </p>
            {/* Additional content if description is an object */}
            {typeof description === "object" &&
              description.mainText &&
              description.mainText !== description.intro && (
                <p className="mb-4 text-gray-700 leading-relaxed">
                  {description.mainText}
                </p>
              )}
            {typeof description === "object" &&
              description.highlight &&
              description.highlight !== description.intro &&
              description.highlight !== description.mainText && (
                <p className="mb-4 text-gray-700 leading-relaxed">
                  {description.highlight}
                </p>
              )}
          </div>
        ) : (
          <p className="mb-4 text-gray-700 leading-relaxed">
            {previewWords.join(" ")}
            {hasMoreContent && "..."}
          </p>
        )}
      </div>

      {hasMoreContent && (
        <button
          className="mt-2 flex items-center text-primary font-medium hover:text-primary-dark transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show less" : "Show more"}
          <svg
            className={`w-5 h-5 ml-1 transform transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Description;
