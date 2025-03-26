"use client";

import React from "react";
import { useState } from "react";

import { Lesson } from "../types";

import SubjectsView from "./SubjectsView";
import LessonView from "./LessonView";

import getLessons from "../actions/getLessons";
import getNewLesson from "../actions/getNewLesson";
import getSubjects from "../actions/getSubjects";
import addSubject from "../actions/addSubject";
import deleteSubject from "../actions/deleteSubject";
import deleteLessons from "../actions/deleteLessons";

import Loading from "../loading";
import addLesson from "../actions/addLesson";

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
    const lessons = await getLessons(await getLocalDate(), subjectChange);
    setActiveSubject(subjectChange);
    setLesson(lessons ? lessons[0] : null);
    setLoading(false);
  }

  async function handleSubjectAdd(newSubject: string) {
    setLoading(true);
    await addSubject(newSubject);
    const updatedSubjects = await getSubjects();
    const newLesson = await getNewLesson({
      date: await getLocalDate(),
      subject: newSubject,
      previousSubjects: [],
    });
    await addLesson(newLesson);
    setSubjects(updatedSubjects);
    setActiveSubject(newSubject);
    setLesson(newLesson);
    setLoading(false);
  }

  async function handleSubjectDelete(oldSubject: string) {
    setLoading(true);
    await deleteSubject(oldSubject);
    await deleteLessons(oldSubject);
    const updatedSubjects = await getSubjects();
    const newActiveSubject =
      updatedSubjects && updatedSubjects.length > 0 ? updatedSubjects[0] : null;
    const lessons = newActiveSubject
      ? await getLessons(await getLocalDate(), newActiveSubject)
      : null;
    setSubjects(updatedSubjects);
    setActiveSubject(newActiveSubject);
    setLesson(lessons ? lessons[0] : null);
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
