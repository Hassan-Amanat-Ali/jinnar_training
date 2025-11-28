import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";

const FAQContent = () => {
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState("general");

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories = [
    { id: "general", label: "General Information", icon: "📋" },
    { id: "account", label: "Account & Access", icon: "🔐" },
    { id: "training", label: "Training Content", icon: "📚" },
    { id: "certification", label: "Quizzes & Certification", icon: "🎓" },
    { id: "free", label: "Free Training Policy", icon: "💚" },
    { id: "support", label: "Troubleshooting & Support", icon: "🛠️" },
    { id: "privacy", label: "Privacy & Security", icon: "🔒" },
    { id: "benefits", label: "Worker Benefits", icon: "⭐" },
  ];

  const faqData = {
    general: [
      {
        id: "g1",
        question: "What is Training.Jinnar and who is it created for?",
        answer: `Training.Jinnar is the official learning and certification platform of the Jinnar ecosystem. It is a free online training mini-platform designed primarily for:

• Informal sector workers – plumbers, welders, mechanics, tailors, electricians, carpenters, masons, cleaners, painters, drivers, technicians, etc.
• People who want to become workers on Jinnar in the future
• Existing workers on Jinnar.com who want to improve their professionalism and customer trust

The main goals of Training.Jinnar are to:
• Teach workers professional behavior (how to talk to customers, keep time, show respect, handle problems, etc.)
• Improve quality of work and customer satisfaction
• Help workers understand safety, communication, and cleanliness standards
• Prepare workers for digital work environments (e.g., online bookings, ratings, reviews, wallet payments)
• Provide certificates and badges that workers can use as proof of training

In simple terms: Training.Jinnar is where workers learn how to become more professional, more trusted, and more ready for better-paying jobs—at no cost.`,
      },
      {
        id: "g2",
        question:
          "Is the training really free, and are there any hidden costs?",
        answer: `Yes. All core training on Training.Jinnar is 100% free of charge.

That includes:
• All lessons in the Worker Excellence Program
• All modules (Professionalism, Communication, Timeliness, etc.)
• All quizzes and exams
• The Worker Excellence Certificate (once completed)
• Access to supporting materials like examples, checklists, and reminders

There are:
❌ No subscription fees
❌ No "unlock" charges for modules
❌ No certificate printing fee from Jinnar's side (you may choose to print it yourself at your own cost)
❌ No hidden SMS or mobile money charges from Jinnar

In the future, Jinnar may add optional advanced or premium programs (for example, specialist trade training or business mastery), but:

The core Worker Excellence Training and Certificate will remain free forever, as part of Jinnar's mission to uplift informal workers across Africa.`,
      },
      {
        id: "g3",
        question:
          "Do I need to be a registered worker on Jinnar.com to access the training?",
        answer: `No. You do not need to be a registered worker on Jinnar.com to start using Training.Jinnar.

You can:
• Join Training.Jinnar even if you are not yet on the Jinnar marketplace
• Use it as a way to prepare yourself before applying as a worker
• Learn the standards Jinnar expects: professionalism, communication, safety, etc.

However, there are extra benefits if you are (or later become) a Jinnar worker:
• Your training progress, certificates, and badges can be connected to your worker profile on the main marketplace
• Customers may see you as a "Jinnar Certified" or trained worker, which can increase trust and bookings

So: You can use the platform without being a Jinnar worker. But it's even more powerful when combined with a worker account on Jinnar.com.`,
      },
      {
        id: "g4",
        question: "Which countries can use the Training.Jinnar platform?",
        answer: `Training.Jinnar is built for Africa-wide use, starting from Tanzania but not limited to it.

The platform is open to users from:
• Tanzania (starting point and core market)
• Kenya, Uganda, Rwanda, Burundi
• Malawi, Zambia, Zimbabwe
• Ghana, Nigeria
• South Africa, Namibia, Botswana
• Ethiopia, Eritrea
• DRC
• And other African countries

Also: Workers outside Africa can technically access the training as long as they have internet, but the content is designed mainly for African informal-sector realities (culture, customer expectations, payment patterns, safety issues, etc.).

If you can open Training.Jinnar in your browser, you can learn—no matter where you live. However, the main benefits (badges, marketplace links, etc.) are focused on Africa, especially where Jinnar operates or plans to expand.`,
      },
      {
        id: "g5",
        question:
          "How does Training.Jinnar connect with the main Jinnar marketplace?",
        answer: `Training.Jinnar is not a separate company — it is a specialized training wing of the Jinnar ecosystem.

Here's how they work together:

1. Shared Mission
   • Jinnar marketplace connects customers with informal workers
   • Training.Jinnar prepares those workers to be professional, reliable, and trusted

2. Shared Data (with consent)
   • When you complete modules on Training.Jinnar, your certification status, badges, and key progress data can be linked to your Jinnar worker profile (if you have one)
   • This allows the marketplace to show that you are a "trained worker"

3. Visible Certificates & Badges
   • After completing the Worker Excellence Program, your certificate can be reflected as a badge or label on your Jinnar profile
   • This helps customers quickly identify workers who have completed formal training

4. Better Matching & Trust
   • Over time, the marketplace may prioritize or highlight workers who have completed training, especially for customers who prefer certified workers

In other words: Training.Jinnar builds your skills. Jinnar marketplace shows those skills to customers. Together, they help you become a more successful, trusted worker.`,
      },
      {
        id: "g6",
        question:
          "Does completing the training increase my chances of getting more jobs?",
        answer: `Short answer: Yes, it can significantly help — but it is not a magic guarantee.

Here's how it helps:

1. Increased Customer Trust
   • Customers are more comfortable hiring workers who are trained in professionalism, communication, safety, and cleanliness
   • When they see badges or certificates on your profile, they know you have made an effort to learn and improve

2. Better Reviews & Ratings
   • The training teaches you how to talk to customers, arrive on time, handle mistakes, and respect people's homes and property
   • This naturally leads to better ratings, more 5-star reviews, and more repeat customers

3. Improved Work Quality & Behavior
   • Training improves your planning, attention to detail, and problem-solving skills
   • Customers notice when a worker is organized, honest, clean, and communicates clearly

4. Stronger Profile on Jinnar
   • Over time, the Jinnar system can use your training status (certified/not certified) as one of the signals in search results and recommendations
   • This means a trained worker may appear more favorably when a customer is comparing options

However: Jinnar cannot guarantee that training alone will give you a specific number of jobs or a specific income. Your success will still depend on your real-world performance, attitude, how you treat customers, and how you handle problems.

Think of it like this: Training.Jinnar opens the door wider for you. Your own behavior and work quality decide how far you walk through that door.`,
      },
    ],
    account: [
      {
        id: "a1",
        question: "How do I create an account on Training.Jinnar?",
        answer: `Creating an account on Training.Jinnar is simple and designed for all workers, including those with basic smartphone skills.

Step-by-Step Account Creation:

1. Visit the website
   Go to training.jinnar.com using any browser (Chrome, Safari, Opera, Edge, Firefox, etc.)

2. Click "Create Account" or "Sign Up"
   This button will usually appear at the top right of the homepage or on the login page

3. Enter your basic details
   You will be asked to provide:
   • Your full name
   • Your mobile phone number
   • Your email (optional in future versions)
   • Your country and city
   • Your trade or skill (e.g., plumber, tailor, welder)
   • A secure password

4. Verify your account
   We may send a code by SMS or a verification email. You must enter the code to activate the account.

5. Log in and begin training
   Once verified, you can instantly start opening modules, reading lessons, taking quizzes, tracking your progress, and working toward your certificate.

Important Notes:
• Signing up is free
• No documents are required to create a training account
• You can change your information later if needed

Training.Jinnar is intentionally designed to be simple and fast to join, even for first-time digital users.`,
      },
      {
        id: "a2",
        question:
          "Can I use the same login details from the Jinnar marketplace?",
        answer: `Yes, in most cases you can — and eventually this will be the recommended method.

If you already have a Jinnar.com worker account:
You may be able to use the same phone number, email, and password to log in to Training.Jinnar.

This makes the experience smoother and allows your:
• Certificates
• Badges
• Training progress
to automatically sync to your main worker profile.

If the systems are not yet fully connected (transition period):
You may need to create a new password, or verify your phone number again. That's normal during the early development stage.

Eventually, both platforms will fully support Single Sign-On (SSO).

Why using the same login is helpful:
• Your training achievements appear on your worker profile
• Customers can see your certifications
• You don't create duplicate accounts
• Your progress is stored under one unique identity

So, while it may not always be mandatory, using the same login details is highly recommended.`,
      },
      {
        id: "a3",
        question: "What should I do if I cannot log in or forgot my password?",
        answer: `If you are unable to log in, here are the most common solutions:

A. Use the "Forgot Password" link
On the login page, click "Forgot Password?" You will be asked to enter your phone number (preferred) or email address. A reset code or link will be sent to you.

B. Enter the verification code
After receiving the code, enter it on the platform, set a new password, and log in again. This process usually takes less than 1 minute.

C. If the code does not arrive, try:
• Check your SMS inbox and spam folder
• Ensure your phone has network coverage
• Wait 1–2 minutes
• Request a new code
• Restart your phone
• Try another browser

D. If the problem continues
Contact our support team at: support@jinnar.com

Provide:
• Your full name
• The phone number you registered with
• A screenshot of the error (if possible)

We will reset your account manually and guide you through the recovery steps.

Common reasons for login issues:
• Wrong password
• Wrong phone number format
• Using a different number than the one used to sign up
• Browser cache issues
• Weak or unstable internet

All of these can be resolved easily.`,
      },
      {
        id: "a4",
        question:
          "Can I access the training using a basic smartphone or low internet connection?",
        answer: `Yes, absolutely. Training.Jinnar is built specifically for workers who may not have expensive phones or strong internet.

Here is why it works well on low-end devices:

✔ Mobile-first design
The entire platform is designed for small screens, low RAM phones, basic Android devices, and simple navigation.

✔ Lightweight lessons
Training materials are short, optimized, easy to load, and mostly text-based with small images.

✔ Minimal data usage
The modules are designed to consume very little data — similar to browsing a simple website.

✔ Offline tolerance (limited)
If your internet drops briefly, your progress is saved, the page will reload quickly, and you can retry quizzes without losing progress.

Recommended minimum connection:
• 2G works, but may be slow
• 3G or 4G is ideal
• Wi-Fi also works but is not required

No special device or advanced phone is needed.`,
      },
      {
        id: "a5",
        question: "Is my personal information safe and protected?",
        answer: `Yes. Jinnar takes privacy and data security very seriously, especially because the platform serves millions of informal-sector workers across Africa—many of whom are using digital tools for the first time.

How your data is protected:
• Your information is stored on secure, encrypted servers
• We use SSL encryption for all connections
• Access to user data is restricted to authorized Jinnar staff only
• We do not sell or share your data with advertisers
• We follow the rules of our Privacy Policy
• We conduct regular security checks
• Passwords are stored using modern security techniques (hashed and encrypted)

What we never do:
• We never sell your data
• We never give your information to third-party advertisers
• We never publish your personal details
• We never use your data to track you outside the platform

What we use your data for (only):
• Training progress
• Certification
• Platform improvement
• Verification for Jinnar marketplace badges
• Security monitoring (fraud prevention)

You are in full control. You can request a copy of your data, correction of your details, deletion of your account, or removal of training history by contacting: support@jinnar.com`,
      },
    ],
    training: [
      {
        id: "t1",
        question: "What topics and skills are covered in the training modules?",
        answer: `The Worker Excellence Training Program covers the essential skills every informal worker needs to succeed—across all industries and countries. The training focuses on professional behavior, communication, safety, reliability, and quality.

The 9 Core Modules include:

1. Professionalism - How to behave at job sites, talk to customers respectfully, protect your reputation, and build long-term trust

2. Communication - How to speak clearly, ask the right questions, give updates, and handle misunderstandings properly

3. Timeliness - How to be on time, plan your schedule, manage delays, and what to do if you are running late

4. Quality of Work - Best practices in doing good work, avoiding mistakes, inspecting your work before leaving, and why quality leads to higher earnings

5. Respect - Respecting customer homes and property, cultural expectations, handling disagreements professionally, and maintaining a friendly attitude

6. Problem Solving - How to analyze a job, fix unexpected issues, remain calm under pressure, and offer solutions customers trust

7. Efficiency - Working smart not just hard, using time and effort wisely, avoiding wasted resources, and meeting customer expectations quickly

8. Tool Preparedness - How to prepare tools before jobs, maintain tools, avoid delays due to missing equipment, and how tool readiness affects customer satisfaction

9. Cleanliness & Safety - Personal cleanliness, clean work environments, protecting customers and yourself, and avoiding injuries and accidents

Additional Supporting Topics:
• Customer psychology
• Handling money or digital payments
• Managing your image as a professional
• Taking responsibility for mistakes
• Avoiding customer conflicts
• Preparing for repeat business
• Daily performance habits`,
      },
      {
        id: "t2",
        question:
          "How long does it take to complete the full Worker Excellence Program?",
        answer: `The total time depends on your pace, but most workers complete the entire program in 1–3 days.

Here is the typical breakdown:

Fast Pace (Focused Workers):
• 4–6 hours total (one long session)

Normal Pace (Taking Breaks):
• 1 day or spread across 2 days

Slow Pace (Reading slowly or using small phones):
• 2–3 days

Flexible learning:
You can start today, continue tomorrow, pause anytime, return later, restart a module, and review previous lessons.

The system saves your progress automatically.

There is no deadline and no penalty for taking longer.`,
      },
      {
        id: "t3",
        question:
          "Do I have to follow the modules in order, or can I choose freely?",
        answer: `You can choose freely, but completing all modules is required for the Worker Excellence Certificate.

The recommended method:
We strongly suggest following the modules in order because:
• Each module builds on the previous one
• The flow follows real job steps
• It creates a clear professional mindset
• Some quizzes assume knowledge from earlier modules

However:
You are not forced to follow the exact sequence. You can skip around, review modules out of order, or return to any module anytime.

Important:
To receive the final certificate, you must:
• Complete all 9 modules, and
• Pass all quizzes/exams

Order does not matter for certificate eligibility—but understanding does.`,
      },
      {
        id: "t4",
        question: "Are the lessons available in both English and Swahili?",
        answer: `Yes. Training.Jinnar supports both English and Swahili.

Every section of the core training—including lessons, examples, warnings, simulations, quizzes, exams, and certification details—is available in clear, simple English and clear, conversational Swahili.

Why both languages?
• Many workers feel comfortable in Swahili
• Some countries prefer English
• Tanzania, Kenya, Uganda, and Rwanda use a mix
• Workers deserve accessible learning regardless of language level

Future plan:
More African languages will be added as the platform expands, including French, Arabic, Amharic, Kinyarwanda, Luganda, Hausa, Yoruba, Shona, and Nyanja.`,
      },
      {
        id: "t5",
        question:
          "Are the training programs suitable for workers with low literacy?",
        answer: `Yes. The training was specifically designed to be easy to understand, even for workers with low reading or writing skills.

Here's how we achieved this:

Simple, clear language
Modules use short sentences, everyday words, and easy examples that reflect real life.

Step-by-step explanations
Workers do not need advanced schooling—every idea is explained simply.

Real-life situations
The lessons use examples from real job sites, making them easy to understand.

Breakdown style
Long text is avoided; instead, content is broken into short paragraphs, clear steps, simple tips, and mistakes to avoid.

Quizzes use simple English & Swahili
Questions are written in plain language to increase understanding.

AI-support ready
The system supports AI assistance so workers can ask questions if a topic is unclear (in future versions).

Whether a worker finished university, high school, or primary school, the lessons are designed so everyone can learn and pass.`,
      },
      {
        id: "t6",
        question:
          "Do the lessons include videos, examples, or real-life scenarios?",
        answer: `Yes. Training.Jinnar lessons include many real-life examples and practical scenarios.

Currently included:

✔ Real-life examples
Scenarios like arriving late to a job, how to talk to a customer, handling misunderstandings, fixing a job done wrongly, managing customer expectations.

✔ Mistakes to avoid
Workers learn what not to do, such as arguing with customers, working with dirty tools, leaving a messy workspace, making excuses, using rude language.

✔ Job-site simulations
These simulate how a job request starts, how a worker should respond, how to ask the right questions, how to clarify details, how to update the customer, and what to say after finishing a job.

✔ Quiz scenarios
Questions include real-life situations, such as "What should you do if you are running late?", "How should you greet a customer when you arrive?", "A customer says your work is not good. What do you do?"

Videos:
Short instructional videos may be added in future phases, but the current system focuses on quick loading, low data consumption, and fast access to ensure workers with basic phones can participate fully.`,
      },
      {
        id: "t7",
        question:
          "Will more languages or advanced courses be added in the future?",
        answer: `Yes. Training.Jinnar will grow significantly over time.

A. Upcoming Languages
We plan to expand to French (West Africa), Arabic (North & East Africa), Amharic (Ethiopia), Kinyarwanda (Rwanda), Luganda (Uganda), Hausa (Nigeria), Yoruba (Nigeria), Shona (Zimbabwe), and Nyanja (Zambia/Malawi).

B. Advanced Courses (Planned)
Future modules may include:

✔ Skill-specific training - Plumbing, Welding, Tailoring, Carpentry, Electrical, Painting, Masonry, Auto mechanics

✔ Business & financial literacy - How to set your prices, manage income, do budgeting, save for tools, grow your business

✔ Safety certifications - Electrical safety, Workplace hazard awareness, Fire safety, Customer property protection

✔ Customer service mastery - Dealing with difficult customers, Building repeat business

✔ Digital literacy - How to use Jinnar effectively, communicate through the app, manage digital payments

C. Live coaching (future)
We also plan to introduce live mentor sessions, group coaching, expert interviews, and step-by-step video demonstrations.`,
      },
    ],
    certification: [
      {
        id: "c1",
        question: "How do quizzes and exams work?",
        answer: `Quizzes and exams on Training.Jinnar are designed to be simple, fair, and practical—not difficult or stressful. They exist to check your understanding and confirm that you are ready to work professionally.

A. Each module has its own quiz
Every module (Professionalism, Communication, Timeliness, etc.) includes a quiz at the end with multiple-choice questions, real-life job scenarios, "What should you do?" situations, and mistake-identification questions.

B. The final exam comes after all modules
Once you complete all 9 modules, you will take a Final Worker Excellence Exam that checks your understanding of professional behavior, customer communication, job-site conduct, safety and cleanliness, problem-solving skills, and how to treat customers respectfully.

C. The system is mobile-friendly
Quizzes are short, easy to read, designed for low internet, and built for small-screen smartphones. You do not need advanced English or high education levels.

D. Progress saves automatically
If your phone switches off or the network fails, your completed questions remain saved and you can continue from where you stopped.

E. Instant results
You receive your score immediately after finishing each quiz or exam, allowing you to understand mistakes, retry if needed, and improve before moving forward.`,
      },
      {
        id: "c2",
        question: "How many attempts do I have for quizzes or exams?",
        answer: `You have unlimited attempts for quizzes and exams.

There is no limit, and you are not punished for retakes.

This is because Training.Jinnar is focused on learning, not punishing.

Unlimited attempts help workers:
• Learn at their own pace
• Practice until they understand
• Build confidence
• Improve professionalism without fear

There are no time restrictions either; you can retake today, tomorrow, next week, or even months later.

You can improve anytime.`,
      },
      {
        id: "c3",
        question: "What score do I need to pass each module?",
        answer: `To pass a module quiz or final exam, you typically need a score of 70% or higher.

This helps ensure:
• You understand the core principles
• You can apply them at work
• You are ready to represent the Jinnar platform professionally

If the platform updates in the future, some modules may require:
• 80% for special badges
• 90% for advanced certificates

But for now: 70% is enough to pass and move toward your certificate.`,
      },
      {
        id: "c4",
        question: "What happens if I fail a quiz or exam?",
        answer: `Nothing bad happens.

There are:
• No penalties
• No account restrictions
• No marks on your profile
• No effect on your job status

If you fail:
1. You will see your score
2. The system may highlight areas to review
3. You can redo the quiz or exam immediately
4. You can retry as many times as you want

The goal is for you to learn, not to fear failure.

Failing is normal. Some workers fail the first time but succeed on the second or third attempt. This is expected and encouraged.

Tip: If you keep failing the same questions, review the section again or take a small break.`,
      },
      {
        id: "c5",
        question: "How do I receive my Worker Excellence Certificate?",
        answer: `Once you complete all 9 modules and pass the final exam, your Worker Excellence Certificate will be automatically generated.

A. Automatic generation
When all requirements are met, the system creates your certificate instantly and it becomes available in your account under "My Certificates".

B. You can download it
The certificate will be available as a PDF file, digital image (PNG/JPEG), and shareable link (in future versions). You can save it to your phone or print it for job applications.

C. It is stored permanently
Even if you lose your phone, your certificate remains saved in your Training.Jinnar account and can be downloaded anytime.

D. It may sync with your Jinnar.com profile
If you have a worker account on Jinnar.com, your certificate can automatically appear as a badge on your worker profile.`,
      },
      {
        id: "c6",
        question: "Are the certificates recognized by customers or employers?",
        answer: `Yes—absolutely.

While Training.Jinnar certificates are not a government-issued qualification (like a formal trade license), they are highly valuable in the Jinnar ecosystem.

Here's why customers trust the certificate:

✔ It proves professionalism
Customers want workers who are respectful, arrive on time, communicate clearly, protect their homes, work safely, and handle problems properly. The certificate shows you have been trained in all of these areas.

✔ Jinnar-certified workers usually get better service ratings
Customers often choose certified workers because they feel safer and more confident.

✔ Employers see it as a sign of maturity and responsibility
Businesses looking for workers also appreciate professionalism and reliability.

✔ It gives you a competitive advantage
If two workers have similar skills but only one has a certificate, customers tend to choose the certified worker.

In short: The Worker Excellence Certificate improves your credibility and trust—even if it is not a government technical license.`,
      },
      {
        id: "c7",
        question:
          "Will my certificate and badges appear on my Jinnar worker profile?",
        answer: `Yes, if you are a registered worker on Jinnar.com.

How it works:

✔ Automatic linking
Once you complete the training, your certificate, training status, badges, and module achievements can automatically appear on your Jinnar worker profile.

What customers will see:
Customers may see labels such as "Jinnar Trained", "Worker Excellence Certified", "Professionalism Certified", "Communication Certified", "Cleanliness & Safety Certified".

These badges give you a strong competitive advantage when customers compare workers.

If you're not on Jinnar.com yet:
You can join later, and your training history will still be linked to your new profile using your phone number, email, or unique user ID.

Nothing is lost.`,
      },
    ],
    free: [
      {
        id: "f1",
        question: "Why is the training offered free of charge?",
        answer: `Training.Jinnar is free because it is built as a social-impact mission, not a profit-driven product.

Jinnar's core purpose is to empower Africa's informal workforce—workers who often lack access to formal training, professional guidance, digital skills, workplace best practices, customer service knowledge, and safety and cleanliness standards.

Many workers cannot afford paid training programs. If training were expensive or difficult to access, millions of skilled people would remain excluded.

Why Jinnar offers free training:

✔ To build trust between workers and customers
Customers feel safer when hiring workers who are trained in professionalism and safety.

✔ To improve service quality across Africa
Better-trained workers lead to fewer conflicts, fewer job complaints, and higher customer satisfaction.

✔ To uplift workers financially
Training helps workers get more bookings, higher ratings, more repeat customers, and better earnings.

✔ To reduce barriers for first-time digital workers
Many African workers are using an online platform for the very first time. Free training ensures that no one is left behind.

✔ To support Jinnar's long-term mission
Jinnar wants to become the most trusted platform for informal work in Africa. Free training is a foundation for professionalism, safety, and respect across all trades.

In short: The training is free because Jinnar wants every worker—regardless of income, education, or location—to have an equal chance to succeed.`,
      },
      {
        id: "f2",
        question: "Will the training always remain free?",
        answer: `Yes. The CORE training will always remain free.

This includes:
• All 9 core Worker Excellence modules
• All lessons
• All quizzes
• The final exam
• The Worker Excellence Certificate
• Future improvements to the core program
• Updates to professionalism and safety standards

This is a permanent policy.

Why it will always remain free:
• It is a foundational part of Jinnar's identity
• The platform depends on trained workers to maintain trust
• Paid barriers would disadvantage low-income workers
• Jinnar's growth strategy is built on accessibility, not exclusivity

Jinnar leadership has made a long-term commitment to keeping the core program free as part of its mission to uplift the workforce.

What "always free" means in practice:
• No subscription fees
• No exam fees
• No "certificate unlock" fees
• No time-based charges
• No hidden costs of any kind

Workers will never be charged to learn how to be professional, respectful, clean, reliable, and safe.`,
      },
      {
        id: "f3",
        question: "Are there plans for optional paid or premium courses?",
        answer: `Yes, but only optional… never required.

Jinnar may introduce paid or premium courses in the future, but these will be optional, advanced, specialized, and not necessary to earn the Worker Excellence Certificate.

Examples of future optional premium offerings:

✔ Trade-specific advanced courses - Plumbing repair masterclass, welding techniques, auto mechanic technical training, carpentry and joinery, domestic electrical work, tailoring and machine maintenance

✔ Business and financial literacy programs - Pricing strategy, budgeting and record keeping, savings and investment basics, customer retention strategies

✔ Industry-specific safety certifications - Electrical safety, chemical handling, fire safety, equipment maintenance

✔ Professional development - Leadership skills, negotiation skills, handling difficult customers, branding and personal marketing

✔ Live coaching or mentorship - Weekly group sessions, one-on-one coaching, specialized coaching by experts

Important: The core Worker Excellence Program will remain free forever.

Paid programs (if introduced) will be like a "bonus", an "upgrade", or a path for workers who want to grow even further.

Workers will never be forced to pay in order to stay active on the Jinnar marketplace or to maintain their core certificate.`,
      },
    ],
    support: [
      {
        id: "s1",
        question: "Who do I contact if I face technical issues?",
        answer: `If you experience any technical problems while using Training.Jinnar—such as login issues, quizzes not loading, missing progress, or error messages—you can contact Jinnar's support team through the following channels:

A. Technical Support Email (Primary Contact)
📧 support@jinnar.com

Use this email for login problems, verification code issues, page loading errors, quiz or exam malfunction, account recovery, progress not syncing, and anything that stops the platform from working properly.

Include: Your name, phone number used for account, a short description of the problem, and a screenshot (if possible).

B. Training Division Email (For content-related issues)
📧 training@jinnar.com (future use)

Use this for mistakes in lessons, errors in exam questions, suggestions to improve learning, and content clarity issues.

C. In-App Help (future upgrade)
The platform will include a "Help" button, a support chatbot, and quick troubleshooting guides.

D. Guaranteed Response Time
We aim to respond within 24 hours (normal days) and 48 hours (busy seasons).

Your learning is important, and the team is committed to helping workers resolve issues quickly.`,
      },
      {
        id: "s2",
        question: "What should I do if my progress is not saved?",
        answer: `Training progress is saved automatically, but sometimes issues can occur due to device settings or unstable internet.

Here are the recommended steps:

A. Check your internet connection
Even a weak connection can interrupt syncing. Try switching to a stronger mobile network, a different location, or Wi-Fi if available.

B. Refresh the page
Press refresh or pull down on your mobile browser. Progress often appears after syncing.

C. Log out and log back in
This forces the system to re-sync your data with the server.

D. Avoid using incognito mode
Private browsing often disables cookies, local storage, and progress tracking. Use the normal browser mode instead.

E. Keep your session active
Leaving the page open for too long (over 30–60 minutes) may break the session due to device memory limits.

F. Clear cache if needed
Sometimes old browser data causes conflicts.

G. If progress is still missing
Contact technical support at: support@jinnar.com

Include the module name, lesson number, and what progress you lost. The support team can manually restore your progress if needed.`,
      },
      {
        id: "s3",
        question: "Why is my quiz not loading or showing results?",
        answer: `There are a few common reasons why quizzes may fail to load or show results:

A. Slow or unstable internet
Quizzes require a connection to load questions and submit results. If your network is weak, questions may not appear, buttons may not respond, and results may fail to upload.
Solution: Move to a location with better connection or retry after refreshing.

B. Browser not supported
Older browsers may have issues loading quizzes correctly. Recommended browsers include Chrome, Safari, Opera, Firefox, and Edge.
Solution: Update your browser or switch to another one.

C. Cache or cookie conflict
Sometimes your phone contains saved data that conflicts with the quiz system.
Solution: Clear your browser cache, restart the browser, and try again.

D. Quiz still loading (especially on slow devices)
Older or basic smartphones may take longer to load the quiz engine.
Solution: Wait 10–20 seconds for the quiz to initialize.

E. Page opened in multiple tabs
If you open Training.Jinnar in more than one tab, quiz sessions may get confused.
Solution: Close extra tabs and keep only one active.

F. Platform maintenance
Occasionally, the training system may be under maintenance.
Solution: Wait and try again after a few minutes.

If the problem continues, contact: support@jinnar.com with module name + screenshot + description.`,
      },
      {
        id: "s4",
        question:
          "How do I report errors or mistakes in the training materials?",
        answer: `We encourage workers to report any issues they find—whether in the lessons, examples, quizzes, exams, or simulations. This helps us maintain high-quality training standards.

Here's how to report an issue:

A. Email the Training Division
📧 training@jinnar.com

Use this if you found a mistake in the content, you believe an answer is marked incorrectly, a sentence is confusing, a scenario seems unrealistic, a translation (English or Swahili) is unclear, or an image or example is broken.

B. Include helpful details:
• Module name
• Lesson number
• Quiz question ID
• A screenshot (if possible)
• A short explanation of what seems wrong

C. Reporting helps everyone
Your report assists other workers, the quality assurance team, future updates, and the credibility of the training system.

D. What we do after your report
The training team reviews it, if confirmed corrections are made, and updates appear in the next system refresh.

Workers play a big role in keeping the content accurate and strong.`,
      },
      {
        id: "s5",
        question:
          "Can I use the platform if my internet connection is unstable?",
        answer: `Yes—but with some limitations.

Training.Jinnar was designed specifically for workers who may have inconsistent or low-quality internet access.

What works well with unstable internet:
✔ Reading lessons - Most lessons are lightweight and load quickly
✔ Viewing text-based content - Minimal data is required
✔ Saving progress - Progress is saved whenever the phone reconnects
✔ Retrying quizzes - If a quiz fails due to connection, retrying works smoothly

What may cause issues with unstable internet:
❌ Loading quizzes - Quizzes require a stable connection to load questions
❌ Submitting exam answers - If the internet drops mid-submit, your answers might not save
❌ Account login - Verification codes may delay if the network is very weak

Tips for workers with unstable internet:
1. Move to an area with stronger signal
2. Use 4G if available
3. Try Wi-Fi at a café or community center
4. Download or screenshot key lessons for review
5. Avoid using incognito mode
6. Keep your browser updated

Summary: You can use Training.Jinnar with unstable internet, especially for reading lessons and saving progress. Only quizzes and exams might require a stronger signal.`,
      },
    ],
    privacy: [
      {
        id: "p1",
        question: "What information does Training.Jinnar collect?",
        answer: `Training.Jinnar collects only the information necessary to create and manage your training account, track your learning progress, issue certificates, improve your learning experience, and maintain platform safety and security.

We do not collect unnecessary or sensitive data, and we do not sell user information.

A. Information you provide directly:
• Full name, phone number, email address (optional)
• Country and city, your trade or skill
• A password you choose, preferred language
• Optional: Profile photo, gender, age group

B. Training and performance data:
• Modules completed, lessons viewed
• Quiz attempts and scores, exam results
• Time spent on lessons, badges earned
• Certification status, interaction with learning materials

C. Automatically collected technical data:
• IP address, device type, browser type
• Page loading speed, session duration, error logs

D. Cookies and local storage:
Used to keep you logged in, save progress, maintain language preference, improve security, and enhance user experience.

E. What we never collect:
• Bank details, mobile money PINs
• Credit/debit card numbers, National ID numbers
• Personal family information, location tracking (GPS)
• Biometrics, sensitive data (religion, political views)

We only collect what is necessary for training and certification.`,
      },
      {
        id: "p2",
        question:
          "Is my training data shared with third parties or advertisers?",
        answer: `No. Training.Jinnar does NOT share your data with advertisers, marketers, or any third-party companies for promotional purposes.

Your data is handled with strict privacy guidelines.

A. We do NOT share your data with:
• Advertising networks
• Marketing companies
• Social media trackers
• Data brokers
• Governments (unless legally required)
• Third parties for commercial gain

Training.Jinnar is not an advertising-funded platform, so your data is never used for personalized ads.

B. When data sharing does happen:

1. Inside the Jinnar ecosystem
If you are a registered worker on Jinnar.com, your badges, certificate status, and training completion results may appear on your public worker profile to improve customer trust. This sharing is optional and directly supports your earning potential.

2. With trusted service providers
These include hosting companies, cloud storage providers, security firms, email verification services, and analytics tools. They are used only to run the platform and must keep your data private.

3. When required by law
If a court, police, or legal authority formally requests information, we may disclose only what is legally necessary. This is extremely rare.

C. Zero commercial data sharing
Your data is used for improving lesson quality, securing the platform, generating certificates, and helping customers trust your professionalism—and nothing else.`,
      },
      {
        id: "p3",
        question: "Can I request deletion of my account and training history?",
        answer: `Yes. You have the right to request the deletion of your account and all associated training data.

Training.Jinnar respects user privacy and gives full control over your personal information.

A. What can be deleted:
• Your account and personal details
• Your training progress
• Quiz/exam scores and certificates
• Any badges earned
• Your training history stored in the system

B. What happens after deletion:
• Your certificate will no longer exist
• Badges will be removed from your Jinnar worker profile (if connected)
• Your progress cannot be restored
• You will need to create a new account if you return
• You will need to retake all modules and exams from the beginning

Data deletion is permanent.

C. How to request deletion:
Email: privacy@jinnar.com or support@jinnar.com

Please include your full name, phone number used during registration, and reason for deletion (optional).

Your request will be processed within 7 days for normal requests and 14 days for full system-wide data erasure.

D. Important note:
If your account is connected to the Jinnar marketplace, deletion may also impact marketplace badges, worker ranking data, and customer trust indicators.`,
      },
    ],
    benefits: [
      {
        id: "b1",
        question: "Does the training guarantee more jobs or higher earnings?",
        answer: `No. The training does not guarantee more jobs or higher income—but it significantly increases your chances.

Here's how it helps:

A. Training improves the behaviors customers care about the most
Customers value good communication, respectful behavior, cleanliness, honesty, arriving on time, quality work, and safety awareness. Training.Jinnar teaches these exact behaviors.

B. Better reviews = more jobs
The Jinnar marketplace relies heavily on reviews, ratings, repeat customers, and customer satisfaction. When you behave like a trained professional, customers notice and this improves your ranking.

C. Training helps you avoid common mistakes
Many workers lose jobs because of poor communication, late arrival, dirty tools, bad attitude, or arguments with customers. Training helps you avoid these issues.

D. Higher professionalism leads to higher earning potential
Workers who are clean, polite, respectful, organized, and skilled in communication often get more repeat business, higher tips, more referrals, and better long-term job stability.

E. But there are no guaranteed numbers
Jinnar cannot guarantee a specific number of jobs or a specific monthly income. Your success depends on your real-world behavior, how you treat customers, your trade skills, your time management, your work quality, and your reliability.

In summary: Training improves your chances of success—but success also depends on your actions, behavior, attitude, and consistency.`,
      },
      {
        id: "b2",
        question:
          "Can a certificate be revoked for misconduct or rule violations?",
        answer: `Yes. Jinnar has the right to revoke or suspend a certificate if a worker shows serious misconduct or violates platform rules.

The certificate shows customers that the worker completed Jinnar training, understands professionalism, and knows customer safety and cleanliness standards. If a worker behaves completely opposite to what they were taught, Jinnar may remove the certificate.

Reasons a certificate may be revoked include:

A. Serious misconduct - Harassing customers, insulting or threatening customers, violent behavior, stealing or attempting theft, damaging customer property, gross unprofessionalism

B. Repeated poor behavior - Many verified complaints, consistently poor ratings, ignoring customer instructions

C. Fraudulent actions - Misrepresenting skills, cheating during exams, using someone else's identity, attempting to manipulate ratings

D. Dangerous behavior - Unsafe work practices, exposing customers to harm, ignoring safety instructions

What happens after revocation:
• The badge disappears from your Jinnar profile
• Customers no longer see you as "Jinnar Certified"
• You may be asked to retake certain modules
• Your worker ranking may drop
• In severe cases, your account may be suspended

Can I earn the certificate again?
Yes. Once you fix the issue and demonstrate improvement, you may be allowed to retake the training and regain your professional badge. Jinnar believes in second chances, but only after real behavioral change.`,
      },
      {
        id: "b3",
        question:
          "Do customers prefer workers who are certified on Training.Jinnar?",
        answer: `Yes. In many cases, customers strongly prefer certified workers.

Here's why:

A. Certification builds trust
Customers know that certified workers have learned respect, cleanliness, communication, time management, safety, professionalism, and problem-solving. This makes customers feel safer and more comfortable.

B. Certified workers are more predictable
Customers value clear communication, good manners, on-time arrival, and responsible behavior. Certificates signal that a worker understands these expectations.

C. Certification reduces customer risk
Trained workers make fewer mistakes, cause fewer misunderstandings, work more safely, handle conflicts better, and protect customer property. This reduces the customer's worry.

D. Certified workers often get higher ratings
Because training improves behavior, customers often give more 5-star reviews, more positive comments, more tips, and more referrals. These ratings help certified workers rise in the marketplace ranking.

E. Jinnar may highlight certified workers
In the future, the marketplace may feature "Certified Worker" filters, higher search visibility, and special badges for trained workers. Customers often click certified workers first.

In summary: Customers trust certified workers more. Trust leads to more bookings, better reviews, and stronger earnings.`,
      },
    ],
  };

  const currentFAQs = faqData[activeCategory] || [];

  return (
    <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-gray-50">
      <div className="section-container px-4 sm:px-6">
        {/* Category Navigation */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-black mb-6 sm:mb-8">
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${
                  activeCategory === category.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-black/70 hover:bg-primary/10 hover:text-primary border border-gray-200"
                }`}
              >
                <span>{category.icon}</span>
                <span className="hidden xs:inline sm:inline">
                  {category.label}
                </span>
                <span className="inline xs:hidden sm:hidden">
                  {category.label.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <FaQuestionCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
              {categories.find((c) => c.id === activeCategory)?.label}
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {currentFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-start sm:items-center justify-between gap-3 sm:gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-sm sm:text-base md:text-lg text-black pr-2">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {openItems[faq.id] ? (
                      <FaChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    ) : (
                      <FaChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    )}
                  </span>
                </button>
                {openItems[faq.id] && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="pt-2 sm:pt-4 border-t border-gray-100">
                      <div className="text-black/70 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 sm:mt-16 max-w-2xl mx-auto text-center">
          <div className="bg-primary/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10">
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4">
              Still have questions?
            </h3>
            <p className="text-black/70 text-sm sm:text-base mb-4 sm:mb-6">
              Can't find the answer you're looking for? Our support team is here
              to help.
            </p>
            <a
              href="mailto:support@jinnar.com"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:bg-primary/90 transition-colors"
            >
              <span>📧</span>
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQContent;
