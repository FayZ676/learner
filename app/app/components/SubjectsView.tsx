import React, { useState, useEffect } from 'react'

import addSubject from "../actions/addSubject";
import getSubjects from "../actions/getSubjects";
import deleteSubject from '../actions/deleteSubject';


interface SubjectsViewProps {
    updateActiveSubject: (selection: string) => void
    activeSubject: string
    loadingLesson: boolean
}


export default function SubjectsView({ updateActiveSubject, activeSubject, loadingLesson }: SubjectsViewProps) {
    const [subjectInput, setSubjectInput] = useState<string | null>(null)
    const [subjects, setSubjects] = useState<string[]>([])

    useEffect(() => {
        async function fetchSubjects() {
            const subjects = await getSubjects()
            if (subjects) {
                setSubjects(subjects)
                updateActiveSubject(subjects[0])
            }
            // NOTE: How should we handle if no subjects
        }
        fetchSubjects();
    }, [])

    function handleAddSubject() {
        if (subjectInput) {
            addSubject(subjectInput).then(() => {
                async function fetchUpdatedSubjects() {
                    const updatedSubjects = await getSubjects();
                    if (updatedSubjects) {
                        setSubjects(updatedSubjects);
                    }
                    // NOTE: How should we handle if no updatedSubject?
                }
                fetchUpdatedSubjects();
                updateActiveSubject(subjectInput)
            });
        }
    }

    function handleChangeSubject(e: React.ChangeEvent<HTMLSelectElement>) {
        updateActiveSubject(e.target.value)
    }

    async function handleDeleteSubject() {
        await deleteSubject(activeSubject)
        const subjects = await getSubjects()
        if (subjects) {
            setSubjects(subjects)
            updateActiveSubject(subjects[0])
        }
        const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
        if (modal) {
            modal.close();
        }
    }

    return (
        <>
            <h2>Subject</h2>
            <div className='flex gap-2 ml-auto '>
                <select className="select w-full" value={activeSubject} onChange={handleChangeSubject}>
                    {subjects.map((subject, index) => {
                        return (<option key={index}>{subject}</option>)
                    })}
                </select>
                <button className="btn" disabled={loadingLesson} onClick={() => {
                    const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
                    if (modal) {
                        modal.showModal();
                    }
                }}>manage</button>
                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                        <ul className="list">
                            {subjects?.map((subject, index) => {
                                return (<li key={index} className="list-row flex justify-between">
                                    <span>{subject}</span>
                                    <button className="btn" onClick={handleDeleteSubject}>delete</button>
                                </li>)
                            })}
                        </ul>
                        <textarea className="textarea w-full" placeholder="Subject" value={subjectInput || ""} onChange={(e) => { setSubjectInput(e.target.value) }}></textarea>
                        <div className="modal-action">
                            <form method="dialog" onSubmit={(e) => {
                                e.preventDefault();
                                handleAddSubject();
                            }}>
                                <button className="btn" disabled={!subjectInput} onClick={() => {
                                    const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
                                    if (modal) {
                                        modal.close();
                                    }
                                }}>add</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </>
    )
}
