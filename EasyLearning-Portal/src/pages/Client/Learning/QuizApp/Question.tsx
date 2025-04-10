import React from "react";

interface QuestionProps {
  question: {
    questionText: string;
    answers: { content: string; isCorrect: boolean }[];
  };
  questionNumber: number;
  totalQuestions: number;
  handleAnswer: (index: number) => void;
}

const Question: React.FC<QuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  handleAnswer,
}) => {
  if (!question) {
    return <div>Loading...</div>;
  }
  return (
    <div className="quiz-question-card">
      <h2>
        Câu hỏi {questionNumber} / {totalQuestions}
      </h2>
      <p>{question.questionText}</p>
      <div className="quiz-options">
        {question.answers.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(index)}>
            {option.content}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
