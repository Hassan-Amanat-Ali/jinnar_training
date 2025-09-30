import React, { useEffect } from "react";
import "./style.css";

const GoogleTranslate = () => {
  useEffect(() => {
    // Add global CSS to prevent body displacement
    const style = document.createElement("style");
    style.textContent = `
      body {
        top: 0 !important;
        margin-top: 0 !important;
        padding-top: 0 !important;
        position: static !important;
        transform: none !important;
      }
      .goog-te-banner-frame,
      iframe.goog-te-banner-frame,
      .goog-te-ftab {
        display: none !important;
        height: 0 !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);

    const googleScript = document.createElement("script");
    googleScript.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    googleScript.async = true;
    document.body.appendChild(googleScript);

    // Function to filter languages
    const filterLanguages = () => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        Array.from(select.options).forEach((option) => {
          if (
            !["en", "fr", "sw"].includes(option.value) && // keep English, French, Swahili
            option.value !== ""
          ) {
            option.remove();
          }
        });
      }
    };

    // Ultra-aggressive function to prevent body displacement
    const forceBodyReset = () => {
      // Force reset body styles using direct style manipulation
      const body = document.body;
      const html = document.documentElement;

      // Reset body
      body.style.cssText = body.style.cssText.replace(
        /top\s*:\s*[^;]+;?/gi,
        ""
      );
      body.style.cssText = body.style.cssText.replace(
        /margin-top\s*:\s*[^;]+;?/gi,
        ""
      );
      body.style.cssText = body.style.cssText.replace(
        /padding-top\s*:\s*[^;]+;?/gi,
        ""
      );
      body.style.cssText = body.style.cssText.replace(
        /position\s*:\s*[^;]+;?/gi,
        ""
      );

      // Force set correct values
      body.style.setProperty("top", "0", "important");
      body.style.setProperty("margin-top", "0", "important");
      body.style.setProperty("padding-top", "0", "important");
      body.style.setProperty("position", "static", "important");
      body.style.setProperty("transform", "none", "important");

      // Reset html element too
      html.style.setProperty("margin-top", "0", "important");
      html.style.setProperty("padding-top", "0", "important");

      // Remove Google Translate classes
      body.classList.remove("translated-ltr", "translated-rtl");

      // Aggressively hide all Google Translate elements
      const selectors = [
        ".goog-te-banner-frame",
        "iframe.goog-te-banner-frame",
        ".goog-te-ftab",
        ".skiptranslate",
        ".goog-te-balloon-frame",
        ".goog-te-menu-frame",
        ".goog-te-spinner-pos",
        ".goog-te-balloon",
      ];

      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.remove(); // Actually remove the elements
        });
      });
    };

    // Run every 50ms for maximum protection
    const intervalId = setInterval(forceBodyReset, 50);

    // Also use requestAnimationFrame for even more frequent checks
    const animationFrameReset = () => {
      forceBodyReset();
      requestAnimationFrame(animationFrameReset);
    };
    animationFrameReset();

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );

      // Initial setup
      setTimeout(() => {
        filterLanguages();
        forceBodyReset();
      }, 500);

      // Multiple observers for maximum coverage
      const observer = new MutationObserver(forceBodyReset);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      });

      // Observer for document changes
      const docObserver = new MutationObserver(forceBodyReset);
      docObserver.observe(document, {
        childList: true,
        subtree: true,
      });

      // Observer specifically for html element
      const htmlObserver = new MutationObserver(forceBodyReset);
      htmlObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["style"],
      });
    };

    return () => {
      clearInterval(intervalId);
      document.head.removeChild(style);
      if (document.body.contains(googleScript)) {
        document.body.removeChild(googleScript);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div className="translate-wrapper">
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;
