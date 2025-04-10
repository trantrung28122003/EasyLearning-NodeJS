import React, { useEffect, useState } from "react";
import "./quizapp.css";
import Result from "./Results";
import Question from "./Question";
import {
  GET_QUESTION_BY_TRAINING_PART,
  GET_SAVED_SCORE_BY_TRAINING_PART,
} from "../../../../constants/API";
import { DoCallAPIWithToken } from "../../../../services/HttpService";
import { HTTP_OK } from "../../../../constants/HTTPCode";

interface Answer {
  content: string;
  isCorrect: boolean;
}

interface QuestionType {
  id: string;
  questionText: string;
  answers: Answer[];
}

interface AnswerDetail {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}
interface ScoreRequest {
  correctAnswersCount: number;
  totalQuestionsCount: number;
}

interface ExerciseQuizProps {
  trainingPartId: string;
  isComplete: boolean;
  onQuizCompleted: (trainingPartId: string, scoreRequest: ScoreRequest) => void;
  onQuizStart: (hasStarted: boolean) => void;
}

const ExerciseQuiz: React.FC<ExerciseQuizProps> = ({
  trainingPartId,
  isComplete,
  onQuizCompleted,
  onQuizStart,
}) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [savedScore, setSavedScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<AnswerDetail[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  const handleAnswer = (selectedOptionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = currentQuestion.answers[selectedOptionIndex];
    const isCorrect = selectedAnswer.isCorrect;

    if (isCorrect) {
      setScore(score + 1);
    }

    const newAnswer: AnswerDetail = {
      question: currentQuestion.questionText,
      selectedAnswer: selectedAnswer.content,
      correctAnswer:
        currentQuestion.answers.find((answer) => answer.isCorrect)?.content ||
        "",
      isCorrect,
    };
    setAnswers([...answers, newAnswer]);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setIsQuizCompleted(true);
      if (!isComplete) {
        const scoreRequest: ScoreRequest = {
          correctAnswersCount: score,
          totalQuestionsCount: questions.length,
        };
        onQuizCompleted(trainingPartId, scoreRequest);
      }
    }
  };

  const restartQuiz = () => {
    setHasStarted(false);
    onQuizStart(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizCompleted(false);
    setAnswers([]);
  };

  const fetchQuestions = async (trainingPartId: string) => {
    try {
      const URL = GET_QUESTION_BY_TRAINING_PART + "/" + trainingPartId;
      const response = await DoCallAPIWithToken(URL, "GET");
      if (response.status === HTTP_OK) {
        setQuestions(response.data.result);
      }
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

  const fetchSavedScore = async (trainingPartId: string) => {
    try {
      const URL = GET_SAVED_SCORE_BY_TRAINING_PART + "/" + trainingPartId;
      const response = await DoCallAPIWithToken(URL, "GET");
      if (response.status === HTTP_OK) {
        setSavedScore(response.data.result.quizScore);
      }
    } catch (error) {
      console.error("Failed to fetch saved score", error);
    }
  };
  const handleStartQuiz = () => {
    setHasStarted(true);
    onQuizStart(true);
  };
  useEffect(() => {
    fetchQuestions(trainingPartId);

    if (isComplete) {
      fetchSavedScore(trainingPartId);
    }
  }, [trainingPartId, isQuizCompleted, isComplete]);

  return (
    <div className="quiz-app">
      {!hasStarted ? (
        <div className="start-quiz-container">
          {isComplete ? (
            <div>
              <h2 style={{ marginBottom: "2rem" }}>
                Bạn đã hoàn thành bài kiểm tra trước đó!
              </h2>
              <p style={{ fontSize: "20px", marginBottom: "1rem" }}>
                Điểm đã lưu của bạn <strong>{savedScore}/10</strong>
              </p>
              <p style={{ fontSize: "18px", marginBottom: "2rem" }}>
                Bạn có thể làm lại bài kiểm tra, tuy nhiên điểm số mới sẽ không
                được lưu.
              </p>
            </div>
          ) : (
            <div>
              <h1 style={{ marginBottom: "4rem" }}>
                Bạn đã sẵn sàng làm bài kiểm tra?
              </h1>
              <p style={{ fontSize: "18px" }}>
                Hãy nhấn nút "Bắt Đầu" để bắt đầu làm bài kiểm tra bài vừa học.
                Chúc bạn ôn tập hiệu quả!
              </p>
            </div>
          )}
          <button className="start-quiz-button" onClick={handleStartQuiz}>
            {isComplete ? "Làm lại bài kiểm tra" : "Bắt đầu làm bài"}
          </button>
        </div>
      ) : isQuizCompleted ? (
        <Result
          score={score}
          totalQuestions={questions.length}
          restartQuiz={restartQuiz}
          answers={answers}
          isComplete={isComplete}
          savedScore={savedScore}
        />
      ) : (
        <Question
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          handleAnswer={handleAnswer}
        />
      )}
    </div>
  );
};

export default ExerciseQuiz;
