import React, { useState } from "react";

import { Trash2 } from "lucide-react";

interface SubjectsViewProps {
  subjects: string[] | null;
  activeSubject: string | null;
  onSubjectChange: (subject: string) => void;
  onSubjectAdd: (subjects: string) => void;
  onSubjectDelete: (subject: string) => void;
  loading: boolean;
}

export default function SubjectsView({
  subjects,
  activeSubject,
  onSubjectChange,
  onSubjectAdd,
  onSubjectDelete,
  loading,
}: SubjectsViewProps) {
  const [subjectInput, setSubjectInput] = useState<string>("");

  function handleAddSubject() {
    if (subjectInput.trim()) {
      onSubjectAdd(subjectInput.trim());
      onSubjectChange(subjectInput.trim());
      setSubjectInput("");
    }
  }

  function openModal() {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  function closeModal() {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }

  return (
    <div className="flex gap-2 ml-auto">
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">Subject</legend>
        <div className="join">
          <select
            className="select w-full join-item"
            value={activeSubject ? activeSubject : ""}
            onChange={(e) => {
              onSubjectChange(e.target.value);
            }}
            disabled={!subjects || loading}
          >
            {subjects &&
              subjects.map((subject, index) => (
                <option key={index}>{subject}</option>
              ))}
          </select>
          <button
            disabled={loading}
            className="btn join-item"
            onClick={openModal}
          >
            manage
          </button>
        </div>
      </fieldset>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4 mt-0">Manage Subjects</h3>
          {subjects && subjects.length > 0 ? (
            <ul className="list-none pl-0">
              {subjects.map((subject, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center rounded-md bg-base-200 p-2 px-3"
                >
                  <span>{subject}</span>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => {
                      onSubjectDelete(subject);
                      closeModal();
                    }}
                  >
                    <Trash2 strokeWidth={2} />
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

          <div className="modal-action flex justify-between">
            <button className="btn" onClick={closeModal}>
              Close
            </button>
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
          </div>
        </div>
      </dialog>
    </div>
  );
}
