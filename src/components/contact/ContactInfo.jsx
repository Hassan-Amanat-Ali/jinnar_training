import React from "react";
import { FiHelpCircle, FiMessageCircle, FiMail } from "react-icons/fi";

const ContactInfo = () => {
  const contactSections = [
    {
      id: 1,
      icon: FiHelpCircle,
      title: "Knowledgebase",
      description: "Browse through all of our knowledge base articles.",
      linkText: "Visit guides & tutorials.",
      href: "#",
    },
    {
      id: 2,
      icon: FiMessageCircle,
      title: "FAQ",
      description:
        "Explore our FAQ for quick, clear answers to common queries.",
      linkText: "Visit FAQ",
      href: "#",
    },
    {
      id: 3,
      icon: FiMail,
      title: "Contact us by email",
      description: "Prefer the written word? Drop us an email at",
      linkText: "support@training.jinnar.com",
      href: "mailto:support@training.jinnar.com",
    },
  ];

  return (
    <div className="flex-1 space-y-6">
      {contactSections.map((section) => {
        const IconComponent = section.icon;
        return (
          <div
            key={section.id}
            className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-200">
                <IconComponent className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black mb-2 tracking-wider ">
                  {section.title}
                </h3>
                <p className="text-black mb-3 text-sm tracking-wider">
                  {section.description}
                </p>
                <a
                  href={section.href}
                  className="text-primary font-medium text-sm hover:underline"
                >
                  {section.linkText}
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactInfo;
