import React, { useState } from "react";
import { UserNote } from "../../../../model/User";
import { DELETE_NOTE_BY_COURSE_AND_USER, UPDATE_NOTE_BY_COURSE_AND_USER } from "../../../../constants/API";
import { DoCallAPIWithToken } from "../../../../services/HttpService";
import { HTTP_OK } from "../../../../constants/HTTPCode";
import { convertSecondsToTime } from "../../../../hooks/useTime";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NoteProps {
  note: UserNote
  onNoteClick: (trainPartId: string, timestamp: number) => void;
  onDelete:(noteId: string) => void;
}

const Note: React.FC <NoteProps> = ({note, onNoteClick, onDelete}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [editedContent, setEditedContent] = useState(note.noteContent);
  const [currentNote, setCurrentNote] = useState(note);

  const handleSave = async () => {
    try {
      const payload = {
        id: note.id,
        noteContent: editedContent, 
      };
      const URL = UPDATE_NOTE_BY_COURSE_AND_USER;
      const response = await DoCallAPIWithToken(URL, "POST", payload);
      if (response.status === HTTP_OK) {
        toast.success("Ghi chú đã được cập nhật thành công!");
        setIsEditing(false);
        setCurrentNote(response.data.result)
        
      }
    } catch (error) {
      console.error("Không thể cập nhật trạng thái hoàn thành:", error);
    }
  };

  const handleDelete = async (noteId: string) => {
  
      const URL = `${DELETE_NOTE_BY_COURSE_AND_USER}?userNoteId=${noteId} `;
      const response = await DoCallAPIWithToken(URL, "DELETE");
      if (response.status === HTTP_OK) {
        toast.success("Ghi chú đã được xóa thành công!"); 
        setIsDeleteModal(false);
        onDelete(note.id); 
      }
    
  };
  return (
    <> 
      <div className="px-3">
        <article className="card bg-light mb-3">
          <header className="px-2  border-0 bg-transparent d-flex align-items-center">
            <button
              className="btn btn-primary note-button me-3"
              style={{ padding: "0 28px", borderRadius: "16px" }}
              onClick={() => onNoteClick(currentNote.trainingPartId, currentNote.timeStamp)}
            >
              {convertSecondsToTime(currentNote.timeStamp)}
            </button>
            <span
              className="fw-semibold note-link"
              style={{ cursor: "pointer" }}
            >
            {currentNote.trainingPartName}
            </span>
            <div className="dropdown ms-auto">
              <button
                className="btn btn-link text-decoration-none"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
              <ul className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => setIsEditing(true)}
                  >
                    Sửa lại ghi chú
                  </button>
                <li>
                  <button className="dropdown-item" onClick={() => setIsDeleteModal(true)}>Xóa ghi chú</button>
                </li>
              </ul>
            </div>
          </header>

          <header className=" px-2 bg-transparent">
            <span className=" text-muted small">Chương: {currentNote.courseEventName}</span>
          </header>
          <div className="card-footer bg-white border-0 py-1 px-3">
            <div className="card-body py-2 px-3" style={{ fontSize: "18px" }}>
              {isEditing ? (
                <>
                  <textarea
                    className="form-control"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button
                    className="btn btn-primary mt-2 me-2"  
                    style={{ padding: "0 18px", borderRadius: "8px" }}
                    onClick={handleSave}
                  >
                    Lưu
                  </button>
                  <button
                    className="btn btn-secondary mt-2 "
                    style={{ padding: "0 18px", borderRadius: "8px" }}
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <span>{currentNote.noteContent}</span>
              )}
            </div>
          </div>
        </article>

        {isDeleteModal && (
          <div
            className="delete-confirmation-form border mb-4 p-2" style={{width: "280px"}}>
            <p className="mb-2" >Bạn có chắc muốn xóa ghi chú này?</p>
            <div className="d-flex justify-content ">
              <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(currentNote.id)}> 
                Xóa
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsDeleteModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        )}

      </div>

    </>
  );
};

export default Note;
