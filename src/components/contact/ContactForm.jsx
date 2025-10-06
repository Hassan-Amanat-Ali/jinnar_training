import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import { Button } from "../ui";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const newErrors = {};

    // Check required fields
    if (!data.firstName || data.firstName.trim() === "") {
      newErrors.firstName = "First Name is required";
    }

    if (!data.lastName || data.lastName.trim() === "") {
      newErrors.lastName = "Last Name is required";
    }

    if (!data.email || data.email.trim() === "") {
      newErrors.email = "Email is required";
    } else {
      // Basic email validation
      const email = data.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!data.message || data.message.trim() === "") {
      newErrors.message = "Message is required";
    } else if (data.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    // Optional phone validation
    if (data.phone && data.phone.trim()) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(data.phone.replace(/[\s\-()]/g, ""))) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.warning("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for FormSubmit
      const submitData = new FormData();

      // Add form fields
      submitData.append("firstName", formData.firstName.trim());
      submitData.append("lastName", formData.lastName.trim());
      submitData.append("email", formData.email.trim());
      submitData.append("phone", formData.phone.trim());
      submitData.append("message", formData.message.trim());

      // Add FormSubmit configuration
      submitData.append(
        "_subject",
        `New Contact Form Submission from ${formData.firstName} ${formData.lastName}`
      );
      submitData.append("_template", "table"); // Use table template for better formatting
      submitData.append(
        "_next",
        window.location.origin + "/contact?success=true"
      );
      submitData.append("_captcha", "false"); // Disable captcha for better UX
      submitData.append(
        "_autoresponse",
        "Thank you for contacting Training Jinnar! We have received your message and will get back to you within 1-2 business days."
      );

      const response = await fetch(
        "https://formsubmit.co/ajax/mugheesurrehman06@gmail.com",
        {
          method: "POST",
          body: submitData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(
          "Message sent successfully! We'll get back to you within 1-2 business days."
        );

        // Reset the form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
        setErrors({});
      } else {
        throw new Error(result.message || "Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        "❌ Unable to send message. Please try again or contact us directly at support@trainingjinnar.com"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass =
      "w-full px-4 py-4 border rounded-md focus:outline-none focus:ring-2 text-black placeholder-gray-500 bg-white transition-colors";
    const errorClass = errors[fieldName]
      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
      : "border-gray-300 focus:ring-primary focus:border-primary";
    return `${baseClass} ${errorClass}`;
  };

  return (
    <div className="flex-1">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name *"
              className={getInputClassName("firstName")}
              disabled={isSubmitting}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name *"
              className={getInputClassName("lastName")}
              disabled={isSubmitting}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address *"
            className={getInputClassName("email")}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number (Optional)"
            className={getInputClassName("phone")}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <textarea
            rows={6}
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Your Message *"
            className={`${getInputClassName("message")} resize-none`}
            disabled={isSubmitting}
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.message.length}/1000 characters
          </p>
        </div>

        {/* Submit Button */}
        <Button
          text={isSubmitting ? "Sending..." : "Send Message"}
          icon={<FiSend className="text-white w-5 h-5" />}
          className="btn-base-large btn-primary w-full py-4 text-lg font-semibold tracking-wider"
          disabled={isSubmitting}
        />
      </form>

      <div className="mt-6 space-y-3">
        <p className="text-sm text-black/60 text-center tracking-wider">
          We'll get back to you in 1-2 business days.
        </p>
        <p className="text-xs text-gray-500 text-center">
          Fields marked with * are required
        </p>
      </div>
    </div>
  );
};

export default ContactForm;
