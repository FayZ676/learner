import React, { useState, useEffect } from 'react'

import addSubject from "../actions/addSubject";
import getSubjects from "../actions/getSubjects";


interface SubjectsViewProps {
    onSelect: (selection: string) => void
}


export default function SubjectsView({ onSelect }: SubjectsViewProps) {
    const [subjectInput, setSubjectInput] = useState<string>("")
    const [subjects, setSubjects] = useState<string[] | null>(null)

    useEffect(() => {
        async function fetchSubjects() {
            setSubjects(await getSubjects())
        }

        fetchSubjects();
    }, [])

    function handleAddSubject() {
        addSubject(subjectInput).then(() => {
            async function fetchUpdatedSubjects() {
                const updatedSubjects = await getSubjects();
                setSubjects(updatedSubjects);
            }
            fetchUpdatedSubjects();
        });
    }

    return (
        <div className='flex gap-2 ml-auto '>
            {
                subjects && <select className="select" onChange={(e) => { onSelect(e.target.value) }}>
                    {subjects.map((subject, index) => {
                        return (<option key={index}>{subject}</option>)
                    })}
                </select>
            }
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
                            <button className="btn" onClick={() => {
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
