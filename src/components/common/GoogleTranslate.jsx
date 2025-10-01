import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./style.css";

const GoogleTranslate = ({ containerId = "google_translate_element" }) => {
  const location = useLocation();
  const initializationRef = useRef(false);
  const timeoutRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const ensureInitialized = (targetId) => {
      // Clear any existing content in the container
      const container = document.getElementById(targetId);
      if (container) {
        container.innerHTML = "";
      }

      if (
        window.google &&
        window.google.translate &&
        window.google.translate.TranslateElement
      ) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,sw,fr",
              autoDisplay: false,
            },
            targetId
          );
          return true;
        } catch (e) {
          console.warn("Failed to initialize Google Translate:", e);
          return false;
        }
      }
      return false;
    };

    const filterLanguages = () => {
      const select = document.querySelector(".goog-te-combo");
      if (select && select.options) {
        Array.from(select.options).forEach((option) => {
          if (
            !["en", "sw", "fr"].includes(option.value) &&
            option.value !== ""
          ) {
            option.remove();
          }
        });
      }
    };

    const checkAndReinitialize = () => {
      const container = document.getElementById(containerId);
      const existingWidget = container?.querySelector(".goog-te-gadget");
      const selectElement = document.querySelector(".goog-te-combo");

      // If container exists but widget is missing or incomplete, reinitialize
      if (container && (!existingWidget || !selectElement)) {
        console.log("Google Translate widget missing, reinitializing...");
        ensureInitialized(containerId);
        // Filter languages after a short delay
        setTimeout(filterLanguages, 500);
      }
    };

    const setupPeriodicCheck = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Check immediately
      checkAndReinitialize();

      // Set up periodic checking
      const periodicCheck = () => {
        checkAndReinitialize();
        timeoutRef.current = setTimeout(periodicCheck, 2000);
      };

      timeoutRef.current = setTimeout(periodicCheck, 1000);
    };

    window._gtPendingIds = window._gtPendingIds || new Set();
    window._gtPendingIds.add(containerId);

    const globalInit = () => {
      const ids = Array.from(window._gtPendingIds || []);
      ids.forEach((id) => ensureInitialized(id));

      // Setup mutation observer to watch for DOM changes
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new MutationObserver((mutations) => {
        let shouldFilter = false;
        mutations.forEach((mutation) => {
          if (
            (mutation.type === "childList" &&
              mutation.target.closest?.(".goog-te-gadget")) ||
            mutation.target.querySelector?.(".goog-te-combo")
          ) {
            shouldFilter = true;
          }
        });

        if (shouldFilter) {
          setTimeout(filterLanguages, 100);
        }
      });

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
      });

      window.setGoogleTranslateLanguage = function setGoogleTranslateLanguage(
        langCode
      ) {
        const attemptSet = (retries = 12) => {
          const select = document.querySelector(".goog-te-combo");
          if (select) {
            select.value = langCode;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            return true;
          }
          if (retries > 0) setTimeout(() => attemptSet(retries - 1), 150);
          return false;
        };
        attemptSet();
      };

      initializationRef.current = true;
      setupPeriodicCheck();
    };

    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = globalInit;
    }

    const existing = document.getElementById("google-translate-script");
    if (!existing) {
      const googleScript = document.createElement("script");
      googleScript.id = "google-translate-script";
      googleScript.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      googleScript.async = true;
      document.body.appendChild(googleScript);
    } else if (initializationRef.current) {
      // Script exists and we've initialized before, just reinitialize
      setupPeriodicCheck();
    } else {
      // Script exists but we haven't initialized, wait for it to load
      setTimeout(() => {
        if (window.googleTranslateElementInit) {
          window.googleTranslateElementInit();
        }
      }, 100);
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [containerId]);

  // Effect to handle route changes
  useEffect(() => {
    if (initializationRef.current) {
      // Wait a bit for the route change to complete
      const timer = setTimeout(() => {
        const container = document.getElementById(containerId);
        const existingWidget = container?.querySelector(".goog-te-gadget");

        if (!existingWidget) {
          console.log("Route changed, reinitializing Google Translate...");
          if (window.googleTranslateElementInit) {
            window.googleTranslateElementInit();
          }
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, containerId]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="translate-wrapper">
      <div id={containerId}></div>
    </div>
  );
};

export default GoogleTranslate;
