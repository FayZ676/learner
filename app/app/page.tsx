"use client"

import { useEffect, useState } from "react";

import getLesson from "./actions/getLesson";
import getSubjects from "./actions/getSubjects";
import addSubject from "./actions/addSubject";

import LessonView from "./components/LessonView";
import { Lesson } from "./types";


function getLocalDate(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}


export default function Home() {
  const [subjectInput, setSubjectInput] = useState<string>("")
  const [subjects, setSubjects] = useState<string[] | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    // const fetchLesson = async () => {
    //   setLesson(await getLesson(getLocalDate()))
    // };

    const fetchSubjects = async () => {
      setSubjects(await getSubjects())
    }
    // fetchLesson();
    fetchSubjects();
  }, [])

  function handleAddSubject() {
    addSubject(subjectInput)
  }

  return (
    <div>
      <div>
        <button className="btn" onClick={() => {
          const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
          if (modal) {
            modal.showModal();
          }
        }}>add subject</button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <textarea className="textarea w-full" placeholder="Subject" value={subjectInput} onChange={(e) => { setSubjectInput(e.target.value) }}></textarea>
            <div className="modal-action">
              <form method="dialog" onSubmit={(e) => {
                e.preventDefault();
                handleAddSubject();
              }}>
                <button className="btn">add</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
      {subjects && <ul>
        {subjects.map((subject, index) => {
          return (
            <li key={index}>
              {subject}
            </li>
          )
        })}
      </ul>}
      {lesson && <LessonView lesson={lesson} />}
    </div>
  );
}
