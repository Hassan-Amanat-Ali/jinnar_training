import React from "react";
import { Layout } from "../components/layout";
import {
  JinnarCoursesHero,
  JinnarCoursesContent,
  JinnarCoursesFeatures,
} from "../components/jinnar-courses";

const JinnarCourses = () => {
  return (
    <Layout>
      <main className="min-h-screen">
        <JinnarCoursesHero />
        <JinnarCoursesContent />
        <JinnarCoursesFeatures />
      </main>
    </Layout>
  );
};

export default JinnarCourses;
