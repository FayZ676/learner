import React, { useState } from 'react';
import addSubject from "../actions/addSubject";
import deleteSubject from '../actions/deleteSubject';
import getSubjects from "../actions/getSubjects";

interface SubjectsViewProps {
    subjects: string[];
    activeSubject: string;
    onSubjectChange: (subject: string) => void;
    onSubjectsUpdate: (subjects: string[]) => void;
    loadingLesson: boolean;
}

export default function SubjectsView({
    subjects,
    activeSubject,
    onSubjectChange,
    onSubjectsUpdate,
    loadingLesson
}: SubjectsViewProps) {
    const [subjectInput, setSubjectInput] = useState<string>("");

    function handleAddSubject() {
        if (subjectInput.trim()) {
            addSubject(subjectInput).then(async () => {
                const updatedSubjects = await getSubjects();
                if (updatedSubjects) {
                    onSubjectsUpdate(updatedSubjects);
                    onSubjectChange(subjectInput);
                }
                setSubjectInput("");
            });
        }
    }

    function handleChangeSubject(e: React.ChangeEvent<HTMLSelectElement>) {
        onSubjectChange(e.target.value);
    }

    async function handleDeleteSubject() {
        if (activeSubject) {
            await deleteSubject(activeSubject);
            const updatedSubjects = await getSubjects();
            if (updatedSubjects && updatedSubjects.length > 0) {
                onSubjectsUpdate(updatedSubjects);
                onSubjectChange(updatedSubjects[0]);
            } else {
                onSubjectsUpdate([]);
                onSubjectChange("");
            }
            closeModal();
        }
    }

    function openModal() {
        const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
        if (modal) {
            modal.showModal();
        }
    }

    function closeModal() {
        const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
        if (modal) {
            modal.close();
        }
    }

    return (
        <>
            <h2>Subject</h2>
            <div className='flex gap-2 ml-auto'>
                {subjects.length > 0 ? (
                    <select
                        className="select w-full"
                        value={activeSubject}
                        onChange={handleChangeSubject}
                        disabled={loadingLesson}
                    >
                        {subjects.map((subject, index) => (
                            <option key={index}>{subject}</option>
                        ))}
                    </select>
                ) : (
                    <div className="select w-full flex items-center justify-center text-gray-500">
                        No subjects available
                    </div>
                )}

                <button
                    className="btn"
                    disabled={loadingLesson}
                    onClick={openModal}
                >
                    manage
                </button>

                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Manage Subjects</h3>

                        {subjects.length > 0 ? (
                            <ul className="list mb-4">
                                {subjects.map((subject, index) => (
                                    <li key={index} className="list-row flex justify-between items-center p-2 border-b">
                                        <span>{subject}</span>
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => {
                                                onSubjectChange(subject); // Select this subject before deletion
                                                handleDeleteSubject();
                                            }}
                                        >
                                            delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mb-4 text-gray-500">No subjects available</p>
                        )}

                        <div className="form-control">
                            <textarea
                                className="textarea textarea-bordered w-full"
                                placeholder="Add new subject"
                                value={subjectInput}
                                onChange={(e) => setSubjectInput(e.target.value)}
                            />
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-primary"
                                disabled={!subjectInput.trim()}
                                onClick={() => {
                                    handleAddSubject();
                                    closeModal();
                                }}
                            >
                                Add Subject
                            </button>
                            <button className="btn" onClick={closeModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            </div>
        </>
    );
}