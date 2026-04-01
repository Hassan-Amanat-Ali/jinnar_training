/**
 * Jinnar Training Courses Data
 * Document-based training resources for Africa's informal sector workers
 */

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const rawJinnarCoursesData = [
  {
    id: 1,
    title: "Jinnar Employees Training Programs",
    description:
      "Comprehensive training program designed for Jinnar employees covering essential workplace skills and procedures.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
    filePath: "/courses/Jinnar - Employees Training Programs.docx",
    fileName: "Jinnar - Employees Training Programs.docx",
  },
  {
    id: 2,
    title: "Basic Business & Financial Literacy",
    description:
      "Essential business and financial literacy skills for entrepreneurs and small business owners.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    filePath:
      "/courses/Jinnar - Training - Basic Business & Financial Literacy.docx",
    fileName: "Jinnar - Training - Basic Business & Financial Literacy.docx",
  },
  {
    id: 3,
    title: "Business Plan Training Program",
    description:
      "Comprehensive guide to creating effective business plans for startups and existing businesses.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    filePath:
      "/courses/Jinnar - Training - Business Plan Training Program.docx",
    fileName: "Jinnar - Training - Business Plan Training Program.docx",
  },
  {
    id: 4,
    title: "Cost Management Training Program",
    description:
      "Learn effective cost management strategies to maximize profitability and business efficiency.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    filePath:
      "/courses/Jinnar - Training - Cost Management Training Program.docx",
    fileName: "Jinnar - Training - Cost Management Training Program.docx",
  },
  {
    id: 5,
    title: "Customer Service Excellence",
    description:
      "Master the art of exceptional customer service to build customer loyalty and business success.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400",
    filePath: "/courses/Jinnar - Training - Customer Service Excellence.docx",
    fileName: "Jinnar - Training - Customer Service Excellence.docx",
  },
  {
    id: 6,
    title: "How to Start a New Business Training Program",
    description:
      "Step-by-step guide for aspiring entrepreneurs to launch their business successfully.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
    filePath:
      "/courses/Jinnar - Training - How to Start a New Business Training Program.docx",
    fileName:
      "Jinnar - Training - How to Start a New Business Training Program.docx",
  },
  {
    id: 7,
    title: "Jinnar Worker Excellence Certification Program",
    description:
      "Certification program designed to enhance worker skills and professional development.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400",
    filePath:
      "/courses/Jinnar - Training - Jinnar Worker Excellence Certification Program.docx",
    fileName:
      "Jinnar - Training - Jinnar Worker Excellence Certification Program.docx",
  },
  {
    id: 8,
    title: "Onboarding & Orientation (For Newcomers)",
    description:
      "Comprehensive onboarding program for new employees and team members.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400",
    filePath:
      "/courses/Jinnar - Training - Onboarding & Orientation (For Newcomers).docx",
    fileName:
      "Jinnar - Training - Onboarding & Orientation (For Newcomers).docx",
  },
  {
    id: 9,
    title: "Partnership Training Program",
    description:
      "Build effective business partnerships and collaborative relationships for mutual growth.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
    filePath: "/courses/Jinnar - Training - Partnership Training Program.docx",
    fileName: "Jinnar - Training - Partnership Training Program.docx",
  },
  {
    id: 10,
    title: "Project Management Training Program",
    description:
      "Essential project management skills for successful project planning and execution.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
    filePath:
      "/courses/Jinnar - Training - Project Management Training Program.docx",
    fileName: "Jinnar - Training - Project Management Training Program.docx",
  },
  {
    id: 11,
    title: "Raising Capital Training Program",
    description:
      "Learn various methods and strategies for raising capital to fund your business ventures.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400",
    filePath:
      "/courses/Jinnar - Training - Raising Capital Training Program.docx",
    fileName: "Jinnar - Training - Raising Capital Training Program.docx",
  },
  {
    id: 12,
    title: "Tier 2 Training Program",
    description:
      "Advanced training program for second-tier employees focusing on specialized skills and leadership development.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
    filePath: "/courses/Jinnar - Training - Tier 2 Training Program.docx",
    fileName: "Jinnar - Training - Tier 2 Training Program.docx",
  },
  {
    id: 13,
    title: "Tier 3 Training Program",
    description:
      "Executive-level training program covering strategic planning, management, and advanced business concepts.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
    filePath: "/courses/Jinnar - Training - Tier 3 Training Program.docx",
    fileName: "Jinnar - Training - Tier 3 Training Program.docx",
  },
  {
    id: 14,
    title: "Time Management for Support & Admin Teams",
    description:
      "Specialized time management training designed for support and administrative teams to improve productivity and efficiency.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400",
    filePath:
      "/courses/Jinnar - Training - Time Management for Jinnar Employees (Support - Admin Teams).docx",
    fileName:
      "Jinnar - Training - Time Management for Jinnar Employees (Support - Admin Teams).docx",
  },
  {
    id: 15,
    title: "Time Management Training Program – Jinnar Workers",
    description:
      "Time management strategies and techniques specifically designed for Jinnar workers.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400",
    filePath:
      "/courses/Jinnar - Training - Time Management Training Program – Jinnar Workers.docx",
    fileName:
      "Jinnar - Training - Time Management Training Program – Jinnar Workers.docx",
  },
  {
    id: 16,
    title: "Understanding Taxes for Small Businesses - Kenya",
    description:
      "Comprehensive tax guide for small business owners in Kenya, covering tax obligations and compliance.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400",
    filePath:
      "/courses/Jinnar - Training - Understanding Taxes for Small Businesses - Kenya.docx",
    fileName:
      "Jinnar - Training - Understanding Taxes for Small Businesses - Kenya.docx",
  },
  {
    id: 17,
    title: "Understanding Taxes for Small Businesses - Uganda",
    description:
      "Comprehensive tax guide for small business owners in Uganda, covering tax obligations and compliance.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400",
    filePath:
      "/courses/Jinnar - Training - Understanding Taxes for Small Businesses - Uganda.docx",
    fileName:
      "Jinnar - Training - Understanding Taxes for Small Businesses - Uganda.docx",
  },
  {
    id: 18,
    title: "Understanding Taxes for Small Businesses – South Africa",
    description:
      "Comprehensive tax guide for small business owners in South Africa, covering tax obligations and compliance.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400",
    filePath:
      "/courses/Jinnar - Training - Understanding Taxes for Small Businesses – South Africa.docx",
    fileName:
      "Jinnar - Training - Understanding Taxes for Small Businesses – South Africa.docx",
  },
  {
    id: 19,
    title:
      "Understanding Taxes for Small Businesses – Tanzania (Shorter Version)",
    description:
      "Concise tax guide for small business owners in Tanzania, covering essential tax information.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
    filePath:
      "/courses/Jinnar - Training - Understanding Taxes for Small Businesses – Tanzania - Shorter Version.docx",
    fileName:
      "Jinnar - Training - Understanding Taxes for Small Businesses – Tanzania - Shorter Version.docx",
  },
  {
    id: 20,
    title: "Teamwork & Collaboration Skills",
    description:
      "Develop effective teamwork and collaboration skills for better workplace productivity and relationships.",
    category: "business",
    thumbnail:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400",
    filePath:
      "/courses/Jinnar - Training- Teamwork & Collaboration Skills.docx",
    fileName: "Jinnar - Training- Teamwork & Collaboration Skills.docx",
  },
];

export const jinnarCoursesData = rawJinnarCoursesData.map((course) => ({
  ...course,
  slug: toSlug(course.title),
}));

export default jinnarCoursesData;
