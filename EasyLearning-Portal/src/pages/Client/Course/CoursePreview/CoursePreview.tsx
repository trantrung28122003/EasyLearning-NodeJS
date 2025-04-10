import React, { useEffect, useRef, useState } from "react";
import "./CoursePreview.css"; 
import { CourseSlim, TrainingPart } from "../../../../model/Course";

interface CoursePreviewProps {
    course: CourseSlim;
    trainingPart: TrainingPart; 
    onClose : () => void;
  }
  
const CoursePreview: React.FC<CoursePreviewProps> = ({course, trainingPart, onClose}) => {
    const [selectedTrainingPart, setSelectedTrainingPart] = useState(trainingPart || "");
    const videoRef = useRef<HTMLVideoElement>(null);
   
    const hanldeSelectedVideo = ( trainingPart: TrainingPart) => {
      setSelectedTrainingPart(trainingPart);
    }  
    console.log(selectedTrainingPart)
    useEffect(() => {
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, [selectedTrainingPart]);
  return (
    <div className="container-course-preview">
          <div className="custom-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Học thử khóa học</h3>
                 <i className="fas fa-times close-button-modal" 
                   onClick={() => onClose() }
                 ></i>
                
              </div>
              <div className="modal-body">
                <div className="course-preview">
                  <h2 >{course.courseName}</h2>
                  <div className="video-wrapper">
                    <video
                     ref={videoRef}
                      controls
                      controlsList="nodownload"
                      className="video-frame"
                    >
                      <source src={selectedTrainingPart.videoUrl} type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ phát video.
                    </video>
                  </div>
                  <h4>{selectedTrainingPart.trainingPartName}</h4>

                  <h5>Những phần học miễn phí của khóa học này</h5>
                  <div className="course-preview">
                  {course.courseEventResponses.map((classEvent) => (
                        classEvent.trainingParts.map((part) =>(
                            part.free &&
                    <div key ={classEvent.id} className="course-item"
                    onClick={() => hanldeSelectedVideo(part)}>
                      <a href="#">{part.trainingPartName}</a>
                    </div>
                    ) )
                )) }
                  </div>
                </div>
                </div>
              <div className="modal-footer-preview">
                <button
                  className="close-modal-button"
                  onClick={() => onClose()}
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => onClose()}></div>
    </div>
  );
};
export default CoursePreview;
