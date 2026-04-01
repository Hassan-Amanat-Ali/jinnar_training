import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaDownload,
  FaEye,
  FaRegClock,
  FaSignal,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { Header } from "../components/layout";
import Footer from "../components/layout/Footer";
import { ScrollToTop } from "../components/ui";
import { ROUTES } from "../constants/routes";
import { CourseService } from "../services";
import pdfCourseArticles from "../data/pdfCourseArticles.json";

const toSlug = (value = "") =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const PdfCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jinnarData, setJinnarData] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState({});

  const handleLessonToggle = (idx, e) => {
    if (e.target.open) {
      setCompletedLessons((prev) => {
        const newSet = new Set(prev);
        newSet.add(idx);
        return newSet;
      });
    }
  };

  const handleSelectOption = (lessonIdx, qIdx, selectedOption) => {
    if (quizSubmitted[lessonIdx]) return;
    setQuizAnswers(prev => ({ ...prev, [`${lessonIdx}_${qIdx}`]: selectedOption }));
  };

  const handleSubmitQuiz = (lessonIdx) => {
    setQuizSubmitted(prev => ({ ...prev, [lessonIdx]: true }));
  };

  const getQuizScore = (lessonIdx, qaList) => {
    if (!qaList || !Array.isArray(qaList)) return 0;
    return qaList.reduce((score, qa, qIdx) => {
      const correctAnswer = qa.correct_answer || (qa.answer ? qa.answer.split('\n')[0] : '');
      return score + (quizAnswers[`${lessonIdx}_${qIdx}`] === correctAnswer ? 1 : 0);
    }, 0);
  };

  useEffect(() => {
    fetch('/courses-detail/jinnar_flawless_data.json')
      .then(res => res.json())
      .then(data => setJinnarData(data))
      .catch(err => console.error("Error fetching jinnar flawless data:", err));
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const result = await CourseService.getCourseById(id);

        if (result.success && result.data) {
          const data = result.data;
          const thumbnail = data.thumbnail?.startsWith("http")
            ? data.thumbnail
            : `${import.meta.env.VITE_API_URL?.replace("/api", "") || "https://api.jinnar.com"}/uploads/courses/${data.thumbnail}`;

          setCourse({
            id: data._id || data.id,
            title: data.title,
            description: data.description,
            detailedDescription: data.detailedDescription,
            image: thumbnail,
            duration: data.duration || "Self-paced",
            level: data.level || "All Levels",
            courseType: data.courseType || "video",
            pdfUrl: data.pdfUrl,
            slug: toSlug(data.title),
          });
        } else {
          setCourse(null);
        }
      } catch (error) {
        console.error("Failed to fetch PDF course detail:", error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const matchedContent = useMemo(() => {
    if (!course || !jinnarData) return null;
    
    // Clean strings for broader matching
    const cleanStr = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const courseMatch = cleanStr(course.title);
    
    if (!courseMatch) return null;

    // First try to match a Program (so we get the complete curriculum)
    for (const prog of jinnarData.programs || []) {
      const progMatch = cleanStr(prog.program_title);
      if (progMatch === courseMatch || progMatch.includes(courseMatch) || courseMatch.includes(progMatch)) {
        return { type: 'program', data: prog };
      }
    }

    // Try to match an individual lesson if no program matched
    for (const prog of jinnarData.programs || []) {
      for (const lesson of prog.lessons || []) {
        const lessonMatch = cleanStr(lesson.lesson_title);
        if (lessonMatch === courseMatch || lessonMatch.includes(courseMatch) || courseMatch.includes(lessonMatch)) {
          return { type: 'lesson', data: lesson, programTitle: prog.program_title };
        }
      }
    }
    
    return null;
  }, [course, jinnarData]);

  const article = useMemo(() => {
    if (!course) {
      return null;
    }

    if (matchedContent) {
      if (matchedContent.type === 'lesson') {
         const lesson = matchedContent.data;
         return {
           subtitle: matchedContent.programTitle,
           readTime: `${lesson.chapters?.length * 2 || 10} min read`,
           lastUpdated: "Recently updated",
           overview: [lesson.lesson_title, "In this lesson, you will learn the following topics and complete related knowledge checks."],
           articleSections: lesson.chapters?.map(ch => ({
              heading: ch.chapter_title?.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')?.trim() || "Chapter",
              paragraphs: ch.content?.split('\n').filter(p => p.trim()) || []
           })),
           faq: lesson.lesson_qa?.map(qa => ({
              question: qa.question,
              correct_answer: qa.correct_answer,
              feedback: qa.feedback,
              options: qa.options
           })),
           learningObjectives: lesson.chapters?.map(ch => ch.chapter_title)
         };
      } else {
         const prog = matchedContent.data;
         return {
           subtitle: "Full Course Program",
           readTime: `${prog.lessons?.length * 20 || 60} min read`,
           lastUpdated: "Recently updated",
           overview: [prog.program_title, `This comprehensive program contains ${prog.lessons?.length || 0} modules designed to thoroughly guide you through the material. Below you will find the complete curriculum, chapters, and knowledge checks.`],
           articleSections: [], // Empty because curriculum will handle it
           curriculum: prog.lessons?.map(lesson => ({
             lessonTitle: lesson.lesson_title,
             chapters: lesson.chapters,
             qa: lesson.lesson_qa
           })),
           faq: [], // Handled inside curriculum
           learningObjectives: prog.lessons?.map(l => l.lesson_title)
         };
      }
    }

    // Fallback to static JSON if no dynamic match found
    const specific = pdfCourseArticles.articles.find(
      (item) => item.slug === course.slug,
    );

    return {
      ...pdfCourseArticles.defaultArticle,
      ...specific,
    };
  }, [course, matchedContent]);

  const pdfFullUrl = useMemo(() => {
    if (!course?.pdfUrl) {
      return null;
    }

    return course.pdfUrl.startsWith("http")
      ? course.pdfUrl
      : `${import.meta.env.VITE_API_URL?.replace("/api", "") || "https://api.jinnar.com"}/uploads/courses/${course.pdfUrl}`;
  }, [course]);

  const handleView = () => {
    if (pdfFullUrl) {
      window.open(pdfFullUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = () => {
    if (!pdfFullUrl || !course) {
      return;
    }

    const link = document.createElement("a");
    link.href = pdfFullUrl;
    link.download = `${course.title}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const insights = useMemo(() => {
    if (!course) {
      return [];
    }

    return [
      {
        label: "Read time",
        value: article?.readTime || "8 min read",
        icon: <FaRegClock className="text-primary" />,
      },
      {
        label: "Duration",
        value: course.duration,
        icon: <FaEye className="text-primary" />,
      },
      {
        label: "Level",
        value: course.level,
        icon: <FaSignal className="text-primary" />,
      },
      {
        label: "Last updated",
        value: article?.lastUpdated || "Recently refreshed",
        icon: <FaRegCalendarAlt className="text-primary" />,
      },
    ];
  }, [article, course]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header floating />
        <main className="flex-grow section-container pt-24 pb-16">
          <div className="animate-pulse max-w-5xl mx-auto">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-6" />
            <div className="h-64 bg-gray-200 rounded-xl mb-6" />
            <div className="h-28 bg-gray-200 rounded-xl" />
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  if (!course || course.courseType !== "pdf") {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header floating />
        <main className="flex-grow section-container pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold text-black mb-3">PDF course not found</h1>
          <p className="text-gray-600 mb-6">
            This course is unavailable or is not a PDF article resource.
          </p>
          <button
            onClick={() => navigate(ROUTES.COURSES)}
            className="btn-base-medium btn-primary"
          >
            Back to Courses
          </button>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header floating />

      <main className="flex-grow bg-gray-50">
        <div className="section-container pt-5 pb-10 space-y-6">
          <button
            onClick={() => navigate(ROUTES.COURSES)}
            className="inline-flex items-center gap-2 text-primary font-medium hover:opacity-80"
          >
            <FaArrowLeft className="text-sm" />
            Back to Courses
          </button>

          <section className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                PDF Course Article
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-gray-700 mb-5">
                {article?.subtitle || course.description}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary font-medium">
                  <FaRegClock />
                  {article?.readTime || "8 min read"}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
                  {course.duration}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
                  {course.level}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleView} className="btn-base-medium btn-primary">
                  <span className="inline-flex items-center gap-2">
                    <FaEye />
                    View PDF
                  </span>
                </button>
                <button
                  onClick={handleDownload}
                  className="btn-base-medium bg-white text-primary border border-primary hover:bg-primary/5"
                >
                  <span className="inline-flex items-center gap-2">
                    <FaDownload />
                    Download PDF
                  </span>
                </button>
              </div>
            </div>

            <div className="lg:w-[420px]">
              <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs uppercase tracking-wide text-white/80 mb-1">
                    Snapshot
                  </p>
                  <p className="text-lg font-semibold leading-snug">
                    {course.detailedDescription || course.description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {insights.map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm"
              >
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {item.label}
                  </p>
                  <p className="text-base font-semibold text-black">{item.value}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100/60 p-6 sm:p-7 shadow-sm">
                <h2 className="text-[19px] font-bold text-gray-900 tracking-tight mb-3">Overview</h2>
                <div className="space-y-3 text-[14.5px] text-gray-600 leading-relaxed">
                  {(article?.overview || [course.description]).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* PROGRAM CURRICULUM RENDER */}
              {article?.curriculum && article.curriculum.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100/60 p-6 sm:p-7 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-gray-100 pb-5">
                    <h2 className="text-[19px] font-bold text-gray-900 tracking-tight">Course Curriculum</h2>
                    <div className="w-full sm:w-48 mt-1 sm:mt-0">
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Progress</span>
                        <span className="text-[12px] font-bold text-gray-800">
                          {Math.round((completedLessons.size / article.curriculum.length) * 100)}%
                        </span>
                      </div>
                      <div className="h-[5px] w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-900 transition-all duration-500 ease-out"
                          style={{ width: `${(completedLessons.size / article.curriculum.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100/80">
                    {article.curriculum.map((lesson, idx) => (
                      <details 
                        key={idx} 
                        onToggle={(e) => handleLessonToggle(idx, e)}
                        className="group bg-white"
                      >
                        <summary className="cursor-pointer py-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors list-none rounded-xl px-2 -mx-2">
                          <div className="flex items-center gap-3.5 pr-4">
                            {completedLessons.has(idx) ? (
                              <div className="w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center flex-shrink-0 transition-all">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border-[1.5px] border-gray-200 text-gray-400 font-medium text-[11px] flex items-center justify-center flex-shrink-0 transition-all">
                                {idx + 1}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-[15px] text-gray-900 leading-tight group-hover:text-primary transition-colors">{lesson.lessonTitle}</p>
                              {lesson.chapters?.length > 0 && <p className="text-[12px] text-gray-400 mt-1 font-medium">{lesson.chapters.length} chapters</p>}
                            </div>
                          </div>
                          <span className="text-gray-300 font-bold group-open:rotate-180 transition-transform duration-300 flex-shrink-0">
                             <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="18"><polyline points="6 9 12 15 18 9"></polyline></svg>
                          </span>
                        </summary>
                        
                        <div className="pl-9 pr-2 pb-5 pt-1 bg-white">
                           {/* Chapters */}
                           {lesson.chapters?.length > 0 && (
                              <div className="space-y-4">
                                 {lesson.chapters.map((ch, cIdx) => (
                                   <div key={cIdx} className="mb-4 relative border-l-[2px] border-primary/20 pl-4 py-0.5 ml-1">
                                      <h5 className="font-semibold text-[14.5px] text-gray-900 mb-2 leading-snug">{ch.chapter_title?.trim()}</h5>
                                      <div className="space-y-2.5">
                                        {ch.content?.split('\n').map((line, lIdx) => {
                                          const tLine = line.trim();
                                          if (!tLine) return null;
                                          if (tLine.startsWith('•') || tLine.startsWith('-')) {
                                            return (
                                              <div key={lIdx} className="flex items-start gap-2.5">
                                                <span className="text-primary mt-[6px] text-[8px] flex-shrink-0">■</span>
                                                <p className="text-gray-600 text-[13.5px] leading-relaxed">{tLine.substring(1).trim()}</p>
                                              </div>
                                            );
                                          }
                                          // Add subtle bolding to key terms before colons (e.g. "Term: Definition")
                                          if (tLine.includes(':') && tLine.split(':')[0].length < 40 && !tLine.startsWith('Example') && !tLine.startsWith('Step')) {
                                             const parts = tLine.split(':');
                                             const boldPart = parts[0];
                                             const rest = parts.slice(1).join(':');
                                             return (
                                               <p key={lIdx} className="text-gray-600 text-[13.5px] leading-relaxed">
                                                 <strong className="font-semibold text-gray-800">{boldPart}:</strong>{rest}
                                               </p>
                                             );
                                          }
                                          return <p key={lIdx} className="text-gray-600 text-[13.5px] leading-relaxed">{tLine}</p>;
                                        })}
                                      </div>
                                   </div>
                                 ))}
                              </div>
                           )}
                           
                           {/* Q&A */}
                           {lesson.qa?.length > 0 && (
                              <div className="mt-6 pt-5 border-t border-gray-50">
                                 <h4 className="font-semibold text-gray-800 text-[13px] mb-4 flex items-center gap-2">
                                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                     Knowledge Check
                                 </h4>
                                 
                                 {quizSubmitted[idx] && (
                                   <div className="mb-5 bg-indigo-50/80 border border-indigo-100 rounded-[12px] p-4 text-center shadow-sm">
                                     <p className="text-[14px] font-bold text-indigo-900">Quiz Completed!</p>
                                     <p className="text-[13px] text-indigo-700 mt-1">
                                       You scored {getQuizScore(idx, lesson.qa)} out of {lesson.qa.length} correct
                                     </p>
                                   </div>
                                 )}

                                 <div className="space-y-4">
                                   {lesson.qa.map((qaItem, qIdx) => {
                                      const selectedAns = quizAnswers[`${idx}_${qIdx}`];
                                      const isSubmitted = quizSubmitted[idx];
                                      const isCorrect = selectedAns === qaItem.correct_answer;
                                      
                                      return (
                                        <div key={qIdx} className={`rounded-[14px] p-4 sm:p-5 transition-colors ${isSubmitted ? (isCorrect ? 'bg-success/5 border border-success/20' : 'bg-red-50/60 border border-red-100') : 'bg-gray-50/80 border border-gray-100/50'}`}>
                                           <p className="font-medium text-[13.5px] text-gray-900 mb-4 leading-snug"><span className="text-gray-400 mr-1">{qIdx + 1}.</span> {qaItem.question}</p>
                                           {qaItem.options && (
                                             <div className="space-y-2 mb-2">
                                               {qaItem.options.map((opt, oIdx) => {
                                                 const isThisSelected = selectedAns === opt;
                                                 const isThisCorrectAns = opt === qaItem.correct_answer;
                                                 let blockStyle = "bg-white border-gray-100 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/30";
                                                 let dotStyle = "border-gray-300";
                                                 
                                                 if (isSubmitted) {
                                                   if (isThisCorrectAns) {
                                                     blockStyle = "bg-success/15 border-success/30 text-success-700 font-medium";
                                                     dotStyle = "border-success bg-success";
                                                   } else if (isThisSelected && !isThisCorrectAns) {
                                                     blockStyle = "bg-red-50 border-red-200 text-red-700";
                                                     dotStyle = "border-red-500 bg-red-500";
                                                   } else {
                                                     blockStyle = "bg-white border-gray-100/60 text-gray-400 opacity-60";
                                                   }
                                                 } else if (isThisSelected) {
                                                   blockStyle = "bg-indigo-50/80 border-indigo-200 text-indigo-700 font-medium shadow-sm";
                                                   dotStyle = "border-indigo-500 bg-indigo-500";
                                                 }

                                                 return (
                                                   <button 
                                                     key={oIdx} 
                                                     onClick={() => handleSelectOption(idx, qIdx, opt)}
                                                     disabled={isSubmitted}
                                                     className={`w-full text-left flex items-start gap-3 rounded-[10px] p-3 text-[13px] border transition-all ${blockStyle}`}
                                                   >
                                                     <div className={`mt-[2px] w-[14px] h-[14px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-colors ${dotStyle}`}>
                                                        {isThisSelected || (isSubmitted && isThisCorrectAns) ? <div className="w-[6px] h-[6px] rounded-full bg-white" /> : null}
                                                     </div>
                                                     <span className="leading-snug">{opt}</span>
                                                   </button>
                                                 );
                                               })}
                                             </div>
                                           )}
                                           {isSubmitted && (
                                             <div className="bg-white rounded-[10px] p-3.5 border border-gray-100 shadow-sm mt-4 animate-fade-in">
                                                <p className={`text-[12.5px] font-semibold ${isCorrect ? 'text-success' : 'text-red-500'}`}>
                                                   {isCorrect ? '✓ Correct' : '✗ Incorrect'}: <span className="text-gray-700 font-medium ml-1">The answer is {qaItem.correct_answer.split(')')[0] || ''}</span>
                                                </p>
                                                {qaItem.feedback && <p className="text-[12.5px] text-gray-500 mt-2 leading-relaxed">{qaItem.feedback}</p>}
                                             </div>
                                           )}
                                        </div>
                                      );
                                   })}
                                 </div>
                                 
                                 {!quizSubmitted[idx] && lesson.qa?.length > 0 && (
                                   <div className="mt-5 flex justify-end">
                                     <button 
                                       onClick={() => handleSubmitQuiz(idx)}
                                       disabled={Object.keys(quizAnswers).filter(k => k.startsWith(`${idx}_`)).length < lesson.qa.length}
                                       className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-[10px] px-5 py-2.5 text-[13px] shadow-sm tracking-wide font-semibold transition-colors flex items-center gap-2"
                                     >
                                       Submit Answers {Object.keys(quizAnswers).filter(k => k.startsWith(`${idx}_`)).length} / {lesson.qa.length}
                                     </button>
                                   </div>
                                 )}
                              </div>
                           )}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* INDIVIDUAL LESSON RENDER */}
              {(article?.articleSections || []).map((section) => (
                <div
                  key={section.heading}
                  className="bg-white rounded-2xl border border-gray-100/60 p-6 sm:p-7 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      {section.heading?.charAt(0) || "•"}
                    </span>
                    <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
                      {section.heading}
                    </h2>
                  </div>
                  <div className="space-y-3 text-[14.5px] text-gray-600 leading-relaxed mb-4">
                    {(section.paragraphs || []).map((paragraph) => (
                      <p key={paragraph} className="whitespace-pre-wrap">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.points?.length > 0 && (
                    <div className="grid gap-2">
                      {section.points.map((point) => (
                        <div
                          key={point}
                          className="flex items-start gap-3 rounded-xl bg-gray-50/80 p-3.5"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success flex-shrink-0" />
                          <span className="text-[13.5px] text-gray-600">{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* INDIVIDUAL LESSON Q&A RENDER */}
              {article?.faq?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100/60 p-6 sm:p-7 shadow-sm">
                  <h2 className="text-[19px] font-bold text-gray-900 tracking-tight mb-5 flex items-center gap-2">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                     Knowledge Check
                  </h2>

                  {quizSubmitted['single'] && (
                    <div className="mb-5 bg-indigo-50/80 border border-indigo-100 rounded-[12px] p-4 text-center shadow-sm">
                      <p className="text-[14px] font-bold text-indigo-900">Quiz Completed!</p>
                      <p className="text-[13px] text-indigo-700 mt-1">
                        You scored {getQuizScore('single', article.faq)} out of {article.faq.length} correct
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {article.faq.map((qaItem, qIdx) => {
                       const selectedAns = quizAnswers[`single_${qIdx}`];
                       const isSubmitted = quizSubmitted['single'];
                       const correctAnswer = qaItem.correct_answer || (qaItem.answer ? qaItem.answer.split('\n')[0] : '');
                       const isCorrect = selectedAns === correctAnswer;
                       
                       return (
                         <div key={qIdx} className={`rounded-[14px] p-4 sm:p-5 transition-colors ${isSubmitted ? (isCorrect ? 'bg-success/5 border border-success/20' : 'bg-red-50/60 border border-red-100') : 'bg-gray-50/80 border border-gray-100/50'}`}>
                            <p className="font-medium text-[14px] text-gray-900 mb-4 leading-snug"><span className="text-gray-400 mr-1">{qIdx + 1}.</span> {qaItem.question}</p>
                            {qaItem.options && (
                              <div className="space-y-2 mb-2">
                                {qaItem.options.map((opt, oIdx) => {
                                  const isThisSelected = selectedAns === opt;
                                  const isThisCorrectAns = opt === correctAnswer;
                                  let blockStyle = "bg-white border-gray-100 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/30";
                                  let dotStyle = "border-gray-300";
                                  
                                  if (isSubmitted) {
                                    if (isThisCorrectAns) {
                                      blockStyle = "bg-success/15 border-success/30 text-success-700 font-medium";
                                      dotStyle = "border-success bg-success";
                                    } else if (isThisSelected && !isThisCorrectAns) {
                                      blockStyle = "bg-red-50 border-red-200 text-red-700";
                                      dotStyle = "border-red-500 bg-red-500";
                                    } else {
                                      blockStyle = "bg-white border-gray-100/60 text-gray-400 opacity-60";
                                    }
                                  } else if (isThisSelected) {
                                    blockStyle = "bg-indigo-50/80 border-indigo-200 text-indigo-700 font-medium shadow-sm";
                                    dotStyle = "border-indigo-500 bg-indigo-500";
                                  }

                                  return (
                                    <button 
                                      key={oIdx} 
                                      onClick={() => handleSelectOption('single', qIdx, opt)}
                                      disabled={isSubmitted}
                                      className={`w-full text-left flex items-start gap-3 rounded-[10px] p-3 text-[13px] border transition-all ${blockStyle}`}
                                    >
                                      <div className={`mt-[2px] w-[14px] h-[14px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-colors ${dotStyle}`}>
                                         {isThisSelected || (isSubmitted && isThisCorrectAns) ? <div className="w-[6px] h-[6px] rounded-full bg-white" /> : null}
                                      </div>
                                      <span className="leading-snug">{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                            {isSubmitted && (
                              <div className="bg-white rounded-[10px] p-3.5 border border-gray-100 shadow-sm mt-4 animate-fade-in">
                                 <p className={`text-[12.5px] font-semibold ${isCorrect ? 'text-success' : 'text-red-500'}`}>
                                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}: <span className="text-gray-700 font-medium ml-1">The answer is {correctAnswer.split(')')[0] || ''}</span>
                                 </p>
                                 {qaItem.feedback && <p className="text-[12.5px] text-gray-500 mt-2 leading-relaxed">{qaItem.feedback}</p>}
                              </div>
                            )}
                         </div>
                       );
                    })}
                  </div>

                  {!quizSubmitted['single'] && article.faq?.length > 0 && (
                    <div className="mt-5 flex justify-end">
                      <button 
                        onClick={() => handleSubmitQuiz('single')}
                        disabled={Object.keys(quizAnswers).filter(k => k.startsWith(`single_`)).length < article.faq.length}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-[10px] px-5 py-2.5 text-[13px] shadow-sm tracking-wide font-semibold transition-colors flex items-center gap-2"
                      >
                        Submit Answers {Object.keys(quizAnswers).filter(k => k.startsWith(`single_`)).length} / {article.faq.length}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <aside className="space-y-2">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-10">
                <h2 className="text-lg font-semibold text-black mb-3">
                  Learning objectives
                </h2>
                <ul className="space-y-3">
                  {(article?.learningObjectives || ["Explore the PDF lesson in depth."]).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-700">
                      <span className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {course.detailedDescription && (
                <div className="bg-primary text-white rounded-3xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-3">Coach's note</h3>
                  <p className="text-white/90 leading-relaxed">
                    {course.detailedDescription}
                  </p>
                </div>
              )}
            </aside>
          </section>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default PdfCourseDetail;

