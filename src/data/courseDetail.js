export const courseDetailData = {
  whatYouWillLearn: [
    'Build 16 web development projects for your portfolio, ready to apply for junior developer jobs',
    'Learn the latest technologies, including Javascript, React, Node and even Web3 development',
    'Build fully-fledged websites and web apps for your startup or business',
    'Work as a freelance web developer',
    'Master frontend development with React',
    'Master backend development with Node',
    'Learn professional developer best practices',
    'Build responsive, accessible, and beautiful layouts',
    'Master frontend development with React',
    'Master backend development with Node',
    'Learn professional developer best practices',
    'Build responsive, accessible, and beautiful layouts',
  ],
  courseContent: {
    summary: {
      sections: 9,
      lectures: 490,
      totalLength: '65 hours',
    },
    sections: [
      {
        title: 'Front-End Web Development',
        stats: '5/5 • 2h 18m',
        expanded: true,
        lectures: [
          { title: 'Welcome to the Course', completed: true, duration: '5:20' },
          {
            title: 'How to Get the Most Out of This Course',
            completed: true,
            duration: '12:45',
          },
          {
            title: 'Setting Up Your Development Environment',
            completed: true,
            duration: '28:10',
          },
          {
            title: 'Web Development Basics Overview',
            completed: true,
            duration: '42:30',
          },
          { title: 'Your First HTML Page', completed: true, duration: '35:15' },
        ],
      },
      { title: 'Introduction to HTML', stats: '7/8 • 3h 45m', expanded: false },
      { title: 'CSS Styling', stats: '3/9 • 4h 30m', expanded: false },
      {
        title: 'JavaScript Fundamentals',
        stats: '0/12 • 6h 15m',
        expanded: false,
      },
      { title: 'React Fundamentals', stats: '0/10 • 5h 45m', expanded: false },
      { title: 'Node.js Basics', stats: '0/8 • 4h 30m', expanded: false },
      { title: 'Express.js', stats: '0/6 • 3h 50m', expanded: false },
      { title: 'MongoDB', stats: '0/7 • 4h 15m', expanded: false },
      { title: 'Web3 Development', stats: '0/10 • 5h 30m', expanded: false },
    ],
  },
  requirements: [
    "No programming experience needed - I'll teach you everything you need to know",
    'A computer with access to the internet',
    'No paid software required',
    "I'll walk you through, step-by-step how to get all the software installed and set up",
  ],
  description: {
    intro:
      'Welcome to the Complete Web Development Bootcamp, the only course you need to learn to code and become a full-stack web developer. With 150,000+ ratings and a 4.8 average, this comprehensive course is trusted by more than 600,000 students!',
    mainText:
      'Even if you have zero programming experience, this course will take you from beginner to mastery. Throughout the course, we cover a massive amount of tools and technologies, including:',
    highlight: 'Front-End Web Development',
  },
  instructor: {
    name: 'Dr. Angela Yu',
    position: 'Developer and Lead Instructor',
    avatar: '/src/assets/images/professor-1.png',
    rating: 4.7,
    reviews: '1,500,000',
    students: '5,000,000',
    courses: 12,
    bio: "I'm Angela, I'm a developer with a passion for teaching. I'm the lead instructor at the London App Brewery, London's leading Programming Bootcamp. I've helped hundreds of thousands of students learn to code",
  },
  studentFeedback: {
    averageRating: 4.8,
    ratingDistribution: [
      { stars: 5, percentage: '78%' },
      { stars: 4, percentage: '15%' },
      { stars: 3, percentage: '5%' },
      { stars: 2, percentage: '1%' },
      { stars: 1, percentage: '1%' },
    ],
    reviews: [
      {
        name: 'Sarah M.',
        time: '2 months ago',
        rating: 5,
        comment:
          "This is hands down the best web development course I've ever taken. Dr. Angela explains complex concepts in a way that's easy to understand. The projects are challenging but fun, and I feel like I've learned so much more than I did in my college courses. Highly",
        helpfulCount: 243,
      },
      {
        name: 'James R.',
        time: '1 month ago',
        rating: 4,
        comment:
          "The course is comprehensive and covers everything you need to know about web development. I especially enjoyed the React and Node.js sections. The only reason I'm giving 4 stars instead of 5 is that some of the content could use updating, particularly the",
        helpfulCount: 178,
      },
      {
        name: 'Priya K.',
        time: '3 weeks ago',
        rating: 5,
        comment:
          "I've tried multiple coding bootcamps and courses, but this is the one that finally made everything click for me. Dr. Yu has a talent for breaking down difficult concepts into manageable pieces. The projects are practical and build on each other nicely. I went from",
        helpfulCount: 32,
      },
    ],
  },
  relatedCourses: [
    {
      title: 'The Complete JavaScript Course 2023: From Zero',
      instructor: 'Jonas Schmedtmann',
      rating: 4.7,
      reviews: '158,345',
      image: '/src/assets/images/course-1.png',
    },
    {
      title: 'React - The Complete Guide 2023',
      instructor: 'Maximilian Schwarzmuller',
      rating: 4.6,
      reviews: '182,574',
      image: '/src/assets/images/course-2.png',
    },
    {
      title: 'The Web Developer Bootcamp 2023',
      instructor: 'Colt Steele',
      rating: 4.7,
      reviews: '246,830',
      image: '/src/assets/images/course-3.png',
    },
  ],
};
