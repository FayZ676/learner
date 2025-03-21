import React, { useState, useEffect } from 'react'

import addSubject from "../actions/addSubject";
import getSubjects from "../actions/getSubjects";


interface SubjectsViewProps {
    updateSubject: (selection: string) => void
    activeSubject: string
    loadingLesson: boolean
}


export default function SubjectsView({ updateSubject, activeSubject, loadingLesson }: SubjectsViewProps) {
    const [subjectInput, setSubjectInput] = useState<string | null>(null)
    const [subjects, setSubjects] = useState<string[] | null>(null)

    useEffect(() => {
        async function fetchSubjects() {
            setSubjects(await getSubjects())
        }
        fetchSubjects();
    }, [])

    function handleAddSubject() {
        subjectInput && addSubject(subjectInput).then(() => {
            async function fetchUpdatedSubjects() {
                const updatedSubjects = await getSubjects();
                setSubjects(updatedSubjects);
            }
            fetchUpdatedSubjects();
            updateSubject(subjectInput)
        });
    }

    function handleChangeSubject(e: React.ChangeEvent<HTMLSelectElement>) {
        updateSubject(e.target.value)
    }

    return (
        <div className='flex gap-2 ml-auto '>
            {
                subjects && <select className="select" value={activeSubject} onChange={handleChangeSubject}>
                    {subjects.map((subject, index) => {
                        return (<option key={index}>{subject}</option>)
                    })}
                </select>
            }
            <button className="btn" disabled={loadingLesson} onClick={() => {
                const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
                if (modal) {
                    modal.showModal();
                }
            }}>new subject</button>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
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
    )
}
