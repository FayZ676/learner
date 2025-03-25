"use client";

import React from "react";
import { useState } from "react";

import { Lesson } from "../types";

import SubjectsView from "./SubjectsView";
import LessonView from "./LessonView";

import getLesson from "../actions/getLesson";
import addSubject from "../actions/addSubject";
import getSubjects from "../actions/getSubjects";
import deleteSubject from "../actions/deleteSubject";
import Loading from "../loading";

interface LearningPageProps {
  initialSubjects: string[] | null;
  initialSubject: string | null;
  initialLesson: Lesson | null;
}

function getLocalDate(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

export default function LearningPage({
  initialSubjects,
  initialSubject,
  initialLesson,
}: LearningPageProps) {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [activeSubject, setActiveSubject] = useState(initialSubject);
  const [lesson, setLesson] = useState(initialLesson);
  const [loading, setLoading] = useState(false);

  async function handleSubjectChange(subjectChange: string) {
    setLoading(true);
    const newLesson = await getLesson(await getLocalDate(), subjectChange);
    setActiveSubject(subjectChange);
    setLesson(newLesson);
    setLoading(false);
  }

  async function handleSubjectAdd(newSubject: string) {
    setLoading(true);
    await addSubject(newSubject);
    const updatedSubjects = await getSubjects();
    const updatedLesson = await getLesson(await getLocalDate(), newSubject);
    setSubjects(updatedSubjects);
    setActiveSubject(newSubject);
    setLesson(updatedLesson);
    setLoading(false);
  }

  async function handleSubjectDelete(oldSubject: string) {
    setLoading(true);
    await deleteSubject(oldSubject);
    const updatedSubjects = await getSubjects();
    const newActiveSubject =
      updatedSubjects && updatedSubjects.length > 0 ? updatedSubjects[0] : null;
    const updatedLesson = newActiveSubject
      ? await getLesson(await getLocalDate(), newActiveSubject)
      : null;
    setSubjects(updatedSubjects);
    setActiveSubject(newActiveSubject);
    setLesson(updatedLesson);
    setLoading(false);
  }

  return (
    <div>
      <SubjectsView
        subjects={subjects}
        activeSubject={activeSubject}
        onSubjectChange={handleSubjectChange}
        onSubjectAdd={handleSubjectAdd}
        onSubjectDelete={handleSubjectDelete}
        loading={loading}
      />
      {!loading ? <LessonView lesson={lesson} /> : <Loading />}
    </div>
  );
}
