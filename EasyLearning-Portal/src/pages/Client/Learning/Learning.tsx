import React, { useEffect, useRef, useState } from "react";
import "./Learning.css";
import {
  CREATE_CERTIFICATE,
  GET_NOTES_BY_COURSE_AND_USER,
  GET_TRAINING_PROGRESS_STATUS,
  UPDATE_TRAINING_PROGRESS,
} from "../../../constants/API";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { HTTP_OK } from "../../../constants/HTTPCode";
import { useNavigate, useParams } from "react-router-dom";
import {
  UserTrainingProgressStatusResponse,
  TrainingPartProgressResponses,
} from "../../../model/Course";
import TrainingPartContent from "./Component/TraininpartContent";
import { EventSlim } from "../../../model/Event";
import "react-toastify/dist/ReactToastify.css";
import Note from "./Component/Note";
import DataLoader from "../../../components/lazyLoadComponent/DataLoader";
import { UserNote } from "../../../model/User";
import { ToastContainer } from "react-toastify";
interface ScoreRequest {
  correctAnswersCount: number;
  totalQuestionsCount: number;
}

const Learning: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { courseId } = useParams<{
    courseId: string;
  }>();
  const navigate = useNavigate();
  const [openEvents, setOpenEvents] = useState<{ [key: string]: boolean }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNoteBox, setIsNoteBox] = useState(false);
  const [selectedTrainingPart, setSelectedTrainingPart] =
    useState<TrainingPartProgressResponses | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [timeStamp, setTimeStamp] = useState<number>(0);
  const [notes, setNotes] = useState<UserNote[]>();
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [defaultOpenCommentBox, setDefaultOpenCommentBox] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNoteBox = () => {
    if (courseId) {
      fetchUserNotesByCourseAndUser(courseId);
    }
    setIsNoteBox(!isNoteBox);
  };

  const toggleEventDetails = (eventName: string) => {
    setOpenEvents((prev) => ({
      ...prev,
      [eventName]: !prev[eventName],
    }));
  };

  const selectTrainingPart = (part: TrainingPartProgressResponses) => {
    if (exerciseStarted) {
      setWarningMessage(
        "Bạn đang làm bài tập, vui lòng hoàn thành bài tập trước khi chuyển sang phần học khác!"
      );
      return;
    }
    setSelectedTrainingPart(part);
  };

  const calculateProgressPercentage = (
    completedLessons: number,
    totalLessons: number
  ) => {
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const [trainingProgressData, setTrainingProgressData] =
    useState<UserTrainingProgressStatusResponse | null>(null);

  const fetchUserTrainingProgress = async (
    courseId: string,
    trainingPartId?: string
  ) => {
    try {
      const URL = GET_TRAINING_PROGRESS_STATUS + "/" + courseId;
      const response = await DoCallAPIWithToken(URL, "GET");
      if (response.status === HTTP_OK) {
        const data = await response.data.result;
        setTrainingProgressData(data);
        doSelectTrainingPart(data, trainingPartId);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const selectTrainingPartById = (
    data: UserTrainingProgressStatusResponse,
    trainingPartId: string
  ) => {
    const trainingParts = data.courseEventsResponses.flatMap(
      (event: EventSlim) => event.trainingPartProgressResponses
    );
    const trainingPartIdIndex = trainingParts.findIndex(
      (part: TrainingPartProgressResponses) => part.id === trainingPartId
    );
    setSelectedTrainingPart(trainingParts[trainingPartIdIndex]);
  };

  const openEventWithTrainingPartId = (
    data: UserTrainingProgressStatusResponse,
    trainingPartId: string
  ) => {
    const selectedEvents = data.courseEventsResponses.filter((event) =>
      event.trainingPartProgressResponses.some(
        (part) => part.id === trainingPartId
      )
    );

    selectedEvents.forEach((event) => {
      setOpenEvents((prevState) => ({
        ...prevState,
        [event.courseEventName]: true,
      }));
    });
  };

  const doSelectTrainingPart = (
    data: UserTrainingProgressStatusResponse,
    trainingPartId?: string
  ) => {
    const trainingParts = data.courseEventsResponses.flatMap(
      (event: EventSlim) => event.trainingPartProgressResponses
    );

    const completedParts = trainingParts.filter(
      (part: TrainingPartProgressResponses) => part.completed === true
    );

    const lastCompletedIndex = trainingParts.indexOf(
      completedParts[completedParts.length - 1]
    );

    const nextTrainingPart = trainingParts[lastCompletedIndex + 1];
    if (trainingPartId) {
      if (trainingPartId) selectTrainingPartById(data, trainingPartId);

      if (sessionStorage.getItem("trainingPartId")) {
        setDefaultOpenCommentBox(true);
        sessionStorage.removeItem("trainingPartId");
      }
      openEventWithTrainingPartId(data, trainingPartId);
    } else {
      if (nextTrainingPart) {
        setSelectedTrainingPart(nextTrainingPart);
        openEventWithTrainingPartId(data, nextTrainingPart.id);
      } else {
        const firstTrainingPart = data.courseEventsResponses
          .flatMap((event: EventSlim) => event.trainingPartProgressResponses)
          .find((part: TrainingPartProgressResponses) => part);
        if (firstTrainingPart) {
          setSelectedTrainingPart(firstTrainingPart);
          openEventWithTrainingPartId(data, firstTrainingPart.id);
        }
      }
    }
  };

  const fetchUserNotesByCourseAndUser = async (courseId: string) => {
    setIsLoading(true);
    try {
      const URL = `${GET_NOTES_BY_COURSE_AND_USER}?courseId=${courseId}`;
      const response = await DoCallAPIWithToken(URL, "GET");
      if (response.status === HTTP_OK) {
        setNotes(response.data.result);
      }
    } catch (error) {
      console.error("Không thể cập nhật trạng thái hoàn thành:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoCompleted = async (trainingPartId: string) => {
    try {
      const URL = UPDATE_TRAINING_PROGRESS + "/" + trainingPartId;
      const response = await DoCallAPIWithToken(URL, "POST");
      if (response.status === HTTP_OK) {
        const updatedTrainingProgress: TrainingPartProgressResponses =
          response.data.result;
        if (courseId)
          fetchUserTrainingProgress(courseId, updatedTrainingProgress.id);
      }
    } catch (error) {
      console.error("Không thể cập nhật trạng thái hoàn thành:", error);
    }
  };

  const handleQuizCompleted = async (
    trainingPartId: string,
    scoreRequest: ScoreRequest
  ) => {
    try {
      const URL = UPDATE_TRAINING_PROGRESS + "/" + trainingPartId;
      const response = await DoCallAPIWithToken(URL, "POST", scoreRequest);
      if (response.status === HTTP_OK) {
        const updatedTrainingProgress: TrainingPartProgressResponses =
          response.data.result;
        if (courseId)
          fetchUserTrainingProgress(courseId, updatedTrainingProgress.id);
      }
    } catch (error) {
      console.error("Không thể cập nhật trạng thái hoàn thành:", error);
    }
  };

  const goToNextPart = () => {
    if (!selectedTrainingPart || !trainingProgressData) return;

    const flatTrainingParts =
      trainingProgressData.courseEventsResponses.flatMap(
        (event) => event.trainingPartProgressResponses
      );

    const currentIndex = flatTrainingParts.indexOf(selectedTrainingPart);
    if (
      currentIndex !== -1 &&
      currentIndex < flatTrainingParts.length - 1 &&
      selectedTrainingPart.completed
    ) {
      setSelectedTrainingPart(flatTrainingParts[currentIndex + 1]);
    }
  };

  const goToPreviousPart = () => {
    if (!selectedTrainingPart || !trainingProgressData) return;

    const flatTrainingParts =
      trainingProgressData.courseEventsResponses.flatMap(
        (event) => event.trainingPartProgressResponses
      );

    const currentIndex = flatTrainingParts.indexOf(selectedTrainingPart);
    if (currentIndex > 0) {
      setSelectedTrainingPart(flatTrainingParts[currentIndex - 1]);
    }
  };

  const isLastTrainingPart = (): boolean => {
    if (!selectedTrainingPart || !trainingProgressData) return false;
    const flatTrainingParts =
      trainingProgressData.courseEventsResponses.flatMap(
        (event) => event.trainingPartProgressResponses
      );
    return (
      selectedTrainingPart === flatTrainingParts[flatTrainingParts.length - 1]
    );
  };

  const fetchCreateCertificate = async () => {
    setIsLoading(true);
    try {
      const URL = CREATE_CERTIFICATE + `?courseId=${courseId}`;
      const response = await DoCallAPIWithToken(URL, "POST");
      if (response.status === HTTP_OK) {
        if (courseId) {
          fetchUserTrainingProgress(courseId);
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const completeCourse = async () => {
    if (selectedTrainingPart?.id && !selectedTrainingPart.completed) {
      try {
        const URL = UPDATE_TRAINING_PROGRESS + "/" + selectedTrainingPart.id;
        const response = await DoCallAPIWithToken(URL, "POST");
        if (response.status === HTTP_OK) {
          const updatedTrainingProgress: TrainingPartProgressResponses =
            response.data.result;
          if (courseId) {
            fetchUserTrainingProgress(courseId, updatedTrainingProgress.id);
          }
        }
      } catch (error) {
        console.error("Không thể cập nhật trạng thái hoàn thành:", error);
      }
      await fetchCreateCertificate();
      navigate("/confirmCertificate", { state: { courseId } });
    } else {
      navigate("/certificate");
    }
  };

  const canSelectTrainingPart = (
    part: TrainingPartProgressResponses
  ): boolean => {
    return part.completed;
  };

  const isNextPart = (part: TrainingPartProgressResponses): boolean => {
    const lastCompletedPart = trainingProgressData?.courseEventsResponses
      .flatMap((event: EventSlim) => event.trainingPartProgressResponses)
      .reverse()
      .find((part: TrainingPartProgressResponses) => part.completed === true);
    const firstTrainingPart =
      trainingProgressData?.courseEventsResponses.flatMap(
        (event: EventSlim) => event.trainingPartProgressResponses
      )[0];
    if (!lastCompletedPart && part === firstTrainingPart) return true;
    if (!lastCompletedPart && part) return false;

    const flatTrainingParts =
      trainingProgressData?.courseEventsResponses.flatMap(
        (event) => event.trainingPartProgressResponses
      );

    if (!flatTrainingParts) return false;

    const lastCompletedIndex = flatTrainingParts.findIndex(
      (part: TrainingPartProgressResponses) => part === lastCompletedPart
    );

    if (lastCompletedIndex === -1) return false;

    return lastCompletedIndex + 1 === flatTrainingParts.indexOf(part);
  };
  const handleWarningMessage = async (message: string) => {
    setWarningMessage(message);
  };
  const closeWarning = () => {
    setWarningMessage(null);
  };

  const handleNoteClick = (trainPartId: string, timestamp: number) => {
    const flatTrainingParts =
      trainingProgressData?.courseEventsResponses.flatMap(
        (event) => event.trainingPartProgressResponses
      );
    if (flatTrainingParts) {
      const trainingPart = flatTrainingParts.find(
        (part: TrainingPartProgressResponses) => part.id === trainPartId
      );
      if (trainingPart) {
        setSelectedTrainingPart(trainingPart);
        setTimeStamp(timestamp);
        setIsNoteBox(!isNoteBox);
      }
    }
  };

  const handDeleteNote = (noteId: string) => {
    if (notes) {
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
    }
  };
  const handleExerciseStarted = (started: boolean) => {
    setExerciseStarted(started);
  };
  const previousCourseIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (courseId && courseId !== previousCourseIdRef.current) {
      const trainingPartId = sessionStorage.getItem("trainingPartId");
      if (trainingPartId && trainingPartId !== "null") {
        fetchUserTrainingProgress(courseId, trainingPartId);
      } else {
        fetchUserTrainingProgress(courseId);
      }
    }
  }, [courseId]);

  return (
    <div className="app">
      <ToastContainer autoClose={2000} />
      <DataLoader isLoading={isLoading} />
      <div className="header">
        <a
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          eLEARNING
        </a>
        <div className="vertical-divider"></div>
        <div className="course-info">
          <span className="course-title">
            {trainingProgressData?.courseName}
          </span>
        </div>
        <div className="course-progress">
          <div
            className="circular-progress"
            style={{
              backgroundImage: `conic-gradient(
                                          #38c9d6 ${calculateProgressPercentage(
                                            trainingProgressData?.completedPartsByCourse ??
                                              0,
                                            trainingProgressData?.totalPartsByCourse ??
                                              0
                                          )}%,
                                          #808080 ${
                                            calculateProgressPercentage(
                                              trainingProgressData?.completedPartsByCourse ??
                                                0,
                                              trainingProgressData?.totalPartsByCourse ??
                                                0
                                            ) || 0
                                          }%
                                        )`,
            }}
          >
            <span className="progress-value">
              {calculateProgressPercentage(
                trainingProgressData?.completedPartsByCourse ?? 0,
                trainingProgressData?.totalPartsByCourse ?? 0
              ) || 0}{" "}
              %
            </span>
          </div>
          <span>
            {trainingProgressData?.completedPartsByCourse ?? 0}/
            {trainingProgressData?.totalPartsByCourse ?? 0} bài học
          </span>
        </div>
        <div className="header-actions">
          <button className="action-btn" onClick={toggleNoteBox}>
            Ghi chú <i className="far fa-sticky-note"></i>
          </button>
          <button className="menu-btn">
            <i className="fas fa-ellipsis-h"></i>
          </button>
          <button
            className="menu-btn"
            onClick={() => {
              navigate("/userCourses");
            }}
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      <div className={`main ${isSidebarOpen ? "" : "with-closed-sidebar"}`}>
        <div className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
          {isSidebarOpen && (
            <>
              <div className="sidebar-header">
                <h4>Nội dung khóa học</h4>
                <button className="btn" onClick={() => setIsSidebarOpen(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="tab-content">
                <dl>
                  {trainingProgressData?.courseEventsResponses.map(
                    (classEvent, eventIndex) => (
                      <React.Fragment key={classEvent.courseEventName}>
                        <div
                          className="toggle-details"
                          onClick={() =>
                            toggleEventDetails(classEvent.courseEventName)
                          }
                        >
                          <div className="header-content">
                            <div className="section-title">
                              {`${eventIndex + 1}. ${
                                classEvent.courseEventName
                              }`}
                            </div>
                            <span className="icon">
                              <i
                                className={`fas ${
                                  openEvents[classEvent.courseEventName]
                                    ? "fa-chevron-up"
                                    : "fa-chevron-down"
                                }`}
                              ></i>
                            </span>
                          </div>
                          <span className="section-progress">
                            {
                              classEvent.trainingPartProgressResponses.filter(
                                (part) => part.completed === true
                              ).length
                            }{" "}
                            / {classEvent.trainingPartProgressResponses.length}{" "}
                            phần học
                          </span>
                        </div>
                        {openEvents[classEvent.courseEventName] && (
                          <div className="details">
                            {classEvent.trainingPartProgressResponses.map(
                              (part, partIndex) => (
                                <div
                                  key={partIndex}
                                  className={`training-part-item ${
                                    part === selectedTrainingPart
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={
                                    canSelectTrainingPart(part) ||
                                    isNextPart(part)
                                      ? () => selectTrainingPart(part)
                                      : undefined
                                  }
                                  style={{
                                    cursor: canSelectTrainingPart(part)
                                      ? "pointer"
                                      : isNextPart(part)
                                      ? "pointer"
                                      : "not-allowed",
                                    opacity: canSelectTrainingPart(part)
                                      ? 1
                                      : isNextPart(part)
                                      ? 1
                                      : 0.5,
                                  }}
                                >
                                  <span style={{ marginLeft: "1rem" }}>
                                    {`${eventIndex + 1}.${partIndex + 1} ${
                                      part.trainingPartName
                                    }`}
                                    <div className="">
                                      {part.trainingPartType === "LESSON" ? (
                                        <>
                                          <i className="fas fa-play-circle"></i>
                                          <span
                                            style={{
                                              fontSize: "12px",
                                              marginLeft: "8px",
                                            }}
                                          >
                                            Lý thuyết
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <i className="fas fa-pen"></i>
                                          <span
                                            style={{
                                              fontSize: "12px",
                                              marginLeft: "8px",
                                            }}
                                          >
                                            Bài tập
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </span>
                                  <span>
                                    {!part.completed && !isNextPart(part) ? (
                                      <i
                                        className="fas fa-lock"
                                        style={{ color: "gray" }}
                                      ></i>
                                    ) : part.completed ? (
                                      <i
                                        className="fas fa-check"
                                        style={{
                                          width: "12px",
                                          height: "12px",
                                          color: "green",
                                        }}
                                      ></i>
                                    ) : null}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    )
                  )}
                </dl>
              </div>
            </>
          )}
        </div>
        <div className="container-content-learning " style={{ flex: "1" }}>
          {selectedTrainingPart && !isLastTrainingPart() ? (
            <TrainingPartContent
              trainingPart={selectedTrainingPart}
              courseInstructor={trainingProgressData?.courseInstructor ?? ""}
              courseId={courseId ? courseId : ""}
              onVideoCompleted={handleVideoCompleted}
              onQuizCompleted={handleQuizCompleted}
              onWarningMessage={handleWarningMessage}
              timestamp={timeStamp}
              onExerciseStarted={handleExerciseStarted}
              defaultOpenCommentBox={defaultOpenCommentBox}
            />
          ) : (
            <div className="col-lg-12 ">
              <div className="centered-content">
                <img
                  src="https://easylearning.blob.core.windows.net/images-videos/congratulations.png"
                  style={{ width: "380px" }}
                  alt="No data"
                />
                <h2 className="success-message">
                  🎉 Chúc mừng bạn đã hoàn thành khóa học! 🎉
                </h2>
                <h3> {trainingProgressData?.courseName}</h3>
                <p>
                  Bạn đã sẵn sàng để nhận chứng chỉ? Hãy nhấn nút bên dưới để
                  lấy chứng chỉ của bạn ngay bây giờ.
                </p>
                <button className="explore-course-btn" onClick={completeCourse}>
                  Hoàn thành và nhận chứng chỉ khóa học
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isNoteBox && (
        <div className="wrapper-note">
          <div className="over-lay" id="note-box" onClick={toggleNoteBox}></div>
          <div className="note-box" id="note-box">
            <div className="note-header d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">Ghi chú</h5>
              <button
                type="button"
                className="close-notes btn btn-outline-primary btn-rounded"
                onClick={toggleNoteBox}
              >
                Đóng cửa sổ
              </button>
            </div>
            {notes &&
              notes.map((note) => (
                <Note
                  key={note.id}
                  note={note}
                  onNoteClick={handleNoteClick}
                  onDelete={handDeleteNote}
                />
              ))}
          </div>
        </div>
      )}

      <div className="footer-learning">
        <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? (
            <i className="fas fa-arrow-left"></i>
          ) : (
            <i className="fas fa-bars"></i>
          )}
        </button>
        <div></div>
        <div className="footer-center-buttons">
          <button
            className="footer-btn"
            onClick={goToPreviousPart}
            disabled={
              !trainingProgressData ||
              !selectedTrainingPart ||
              trainingProgressData.courseEventsResponses
                .flatMap((event) => event.trainingPartProgressResponses)
                .indexOf(selectedTrainingPart) === 0
            }
          >
            <i className="fas fa-chevron-left"></i> BÀI TRƯỚC
          </button>
          {isLastTrainingPart() ? (
            <button className="footer-btn">
              HOÀN THÀNH <i className="fas fa-chevron-right"></i>
            </button>
          ) : (
            <button
              className="footer-btn"
              onClick={goToNextPart}
              disabled={
                !selectedTrainingPart || !selectedTrainingPart.completed
              }
            >
              BÀI TIẾP THEO <i className="fas fa-chevron-right"></i>
            </button>
          )}
        </div>
      </div>
      {warningMessage && (
        <div className="warning-overlay">
          <div className="warning-modal">
            <h3>{warningMessage}</h3>
            <button className="warning-close-button" onClick={closeWarning}>
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learning;
