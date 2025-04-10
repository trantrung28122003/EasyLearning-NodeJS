import React, { useState, useRef, useEffect } from "react";
import { TrainingPartProgressResponses } from "../../../../model/Course";
import ExerciseQuiz from "../QuizApp/ExerciseQuiz";
import Comments from "./Comment";
import { convertSecondsToTime } from "../../../../hooks/useTime";
import { ADD_NOTE_BY_COURSE_AND_USER } from "../../../../constants/API";
import { DoCallAPIWithToken } from "../../../../services/HttpService";
import { HTTP_OK } from "../../../../constants/HTTPCode";
import { toast } from "react-toastify";

interface ScoreRequest {
  correctAnswersCount: number;
  totalQuestionsCount: number;
}
interface TrainingPartContentProps {
  trainingPart: TrainingPartProgressResponses;
  courseId: string;
  courseInstructor: string;
  timestamp: number;
  defaultOpenCommentBox: boolean;
  onVideoCompleted: (trainingPartId: string) => Promise<void>;
  onQuizCompleted: (
    trainingPartId: string,
    scoreRequest: ScoreRequest
  ) => Promise<void>;
  onWarningMessage: (message: string) => Promise<void>;
  onExerciseStarted: (started: boolean) => void;
}

const TrainingPartContent: React.FC<TrainingPartContentProps> = ({
  trainingPart,
  courseId,
  courseInstructor,
  defaultOpenCommentBox,
  onVideoCompleted,
  onQuizCompleted,
  onWarningMessage,
  timestamp,
  onExerciseStarted,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isCommentBox, setIsCommentBox] = useState(defaultOpenCommentBox);
  const [actualWatchTime, setActualWatchTime] = useState(0);
  const [previousTime, setPreviousTime] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const [noteContent, setNoteContent] = useState("");
  const [isNoteForm, setIsNoteForm] = useState(false);
  const [showNotificationNote, setShowNotificationNote] = useState(false);
  const skipLimit = 10;
  const handleQuizCompleted = (
    trainingPartId: string,
    scoreRequest: ScoreRequest
  ) => {
    onQuizCompleted(trainingPartId, scoreRequest);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const percentWatched = (currentTime / duration) * 100;
      setCurrentTime(currentTime);
      if (percentWatched >= 90 && !hasCompleted && !trainingPart.completed) {
        onVideoCompleted(trainingPart.id);
        setHasCompleted(true);
      }
      setPreviousTime(currentTime);
      if (Math.floor(currentTime) > actualWatchTime) {
        setActualWatchTime((prevTime) => prevTime + 1);
      }
    }
  };

  const toggleCommentBox = () => {
    setIsCommentBox(!isCommentBox);
  };
  const handleSeeking = (trainingPartComplete: boolean) => {
    if (!trainingPartComplete) {
      if (videoRef.current != null) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        setCurrentTime(currentTime);
        const maxSkipTime = (duration * 30) / 100;
        if (currentTime > maxSkipTime && actualWatchTime + 20 < currentTime) {
          onWarningMessage(
            "Bạn đã tua quá nhanh! Video sẽ quay lại vị trí trước đó."
          );
          videoRef.current.currentTime = previousTime;
          videoRef.current.pause();
        } else if (currentTime > previousTime) {
          setSkipCount((prevCount) => prevCount + 1);
          if (skipCount + 1 >= skipLimit) {
            onWarningMessage(
              "Bạn đang tua quá nhiều lần! Hãy xem video nghiêm túc."
            );
            videoRef.current.currentTime = previousTime;
            videoRef.current.pause();
            setSkipCount(0);
          }
        }
      }
    }
  };
  const hanldeAddNote = () => {
    setIsNoteForm(true);
    videoRef.current?.pause();
  };
  const hanldeSubmitNote = async () => {
    if (noteContent.trim()) {
      try {
        const payLoad = {
          noteContent: noteContent,
          courseId: courseId,
          trainingPartId: trainingPart.id,
          timestamp: currentTime,
        };
        const URL = ADD_NOTE_BY_COURSE_AND_USER;
        const response = await DoCallAPIWithToken(URL, "POST", payLoad);
        if (response.status === HTTP_OK) {
          setNoteContent("");
          setIsNoteForm(false);
          toast.success("Ghi chú đã được xóa thành công!");
          setShowNotificationNote(true);
          setTimeout(() => {
            setShowNotificationNote(false);
          }, 5000);
        }
      } catch (error) {
        console.error("Không thể cập nhật trạng thái hoàn thành:", error);
      }
    } else {
      onWarningMessage("Nội dung ghi chú không được để trống!");
    }
  };
  const handleQuizStart = (started: boolean) => {
    onExerciseStarted(started);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (timestamp) videoRef.current.currentTime = timestamp;
      setActualWatchTime(timestamp);
    }
    setHasCompleted(trainingPart.completed);
    const handleDocumentClick = () => {
      setShowNotificationNote(false);
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [trainingPart.id, timestamp]);

  return (
    <>
      {showNotificationNote && (
        <div className="notification">
          <span>Ghi chú của bạn ở đây!</span>
        </div>
      )}
      <div className="video-player">
        {trainingPart.trainingPartType === "LESSON" ? (
          <div className="video">
            <video
              ref={videoRef}
              controls
              controlsList="nodownload"
              style={{ border: "1px solid ccc", borderRadius: "5px" }}
              onTimeUpdate={handleTimeUpdate}
              onContextMenu={(e) => {
                e.preventDefault();
                return false;
              }}
              onSeeking={() => handleSeeking(trainingPart.completed)}
            >
              <source src={trainingPart.videoUrl} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ phát video.
            </video>
          </div>
        ) : (
          <ExerciseQuiz
            trainingPartId={trainingPart.id}
            isComplete={trainingPart.completed}
            onQuizCompleted={handleQuizCompleted}
            onQuizStart={handleQuizStart}
          />
        )}
        {isNoteForm && (
          <div className="note-form">
            <h5 className="title-note">
              Thêm ghi chú tại <span>{convertSecondsToTime(currentTime)}</span>
            </h5>
            <textarea
              placeholder="Nhập nội dung ghi chú..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={hanldeSubmitNote}
              disabled={!noteContent.trim()}
            >
              Lưu ghi chú
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsNoteForm(false)}
            >
              Hủy
            </button>
          </div>
        )}
        <div className="video-info">
          <h2 style={{ maxWidth: "40rem" }}>{trainingPart.trainingPartName}</h2>
          <div className="video-details"></div>
          <p className="last-updated">
            <i className="fas fa-exclamation-circle"></i> {""}Cập nhập gần đây
            nhất:{" "}
            {new Date(trainingPart.dateChange).toLocaleDateString("vi-VN")} |
            Ngôn Ngữ: Tiếng việt
          </p>
          <div className="course-stats">
            <span>
              Người hướng dẫn: <strong> {courseInstructor}</strong>
            </span>{" "}
            |{" "}
            <span>
              Bài học:{" "}
              <strong>
                {trainingPart.trainingPartType == "LESSON"
                  ? "Lý thuyết"
                  : "Bài Tập"}
              </strong>
            </span>
          </div>
          <div className="note">
            <button className="btn-note" onClick={hanldeAddNote}>
              <i className="fas fa-plus"></i>{" "}
              <span style={{ marginLeft: "12px" }}>Thêm ghi chú tại </span>
              <strong>{convertSecondsToTime(currentTime)}</strong>
            </button>
          </div>
          <div className="note">
            <button className="btn-comment" onClick={toggleCommentBox}>
              <i className="fas fa-comment"></i>
              <span style={{ marginLeft: "3px" }}>Hỏi đáp</span>
            </button>
          </div>
          {isCommentBox && (
            <div className="wrapper-note">
              <div className="over-lay" onClick={toggleCommentBox}>
                {" "}
              </div>
              <div className="comment-box">
                <div className="note-header d-flex justify-content-between align-items-center p-3">
                  <h5 className="mb-0">Hỏi đáp về phần học</h5>
                  <button
                    type="button"
                    className="close-notes btn btn-outline-primary btn-rounded"
                    onClick={toggleCommentBox}
                  >
                    Đóng cửa sổ
                  </button>
                </div>
                <Comments trainingPartId={trainingPart.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrainingPartContent;
