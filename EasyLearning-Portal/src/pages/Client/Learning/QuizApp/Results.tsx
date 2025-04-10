import React from "react";

interface AnswerDetail {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface ResultProps {
  score: number;
  totalQuestions: number;
  answers: AnswerDetail[];
  restartQuiz: () => void;
  isComplete: boolean;
  savedScore: number;
}

const Result: React.FC<ResultProps> = ({
  score,
  totalQuestions,
  answers,
  restartQuiz,
  isComplete,
  savedScore,
}) => {
  return (
    <div className="quiz-result-card">
      <h1>
        Tổng số câu đúng : {score} / {totalQuestions}
      </h1>
      <p style={{ fontSize: "20px", marginBottom: "1rem" }}>
        Điểm đã lưu của bạn <strong>{savedScore}/10</strong>
      </p>
      <p>Tóm tắt các câu trả lời</p>
      <ul className="quiz-answer-list">
        {answers.map((answer, index) => (
          <li
            key={index}
            className={`quiz-answer-item ${
              answer.isCorrect ? "correct" : "incorrect"
            }`}
          >
            <p>
              <strong>Câu hỏi {index + 1}:</strong> {answer.question}
            </p>
            <p>
              <span>Câu trả lời của bạn: {answer.selectedAnswer}</span>{" "}
              <span> | </span>
              <span> Câu trả lời đúng: {answer.correctAnswer}</span>
            </p>
            <p className={answer.isCorrect ? "correct" : "incorrect"}>
              {answer.isCorrect ? "✅ Đúng" : "❌ Sai"}
            </p>
          </li>
        ))}
      </ul>
      <button className="" onClick={restartQuiz}>
        Hoàn thành bài kiểm tra
      </button>
    </div>
  );
};

export default Result;
