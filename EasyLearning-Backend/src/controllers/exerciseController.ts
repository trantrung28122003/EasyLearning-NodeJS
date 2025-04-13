import ExerciseQuestion from '../models/exerciseQuestion';
import Answer from '../models/answer';
import { IAnswer } from '../models/answer';
import { Types } from 'mongoose';
import exerciseQuestion from '../models/exerciseQuestion';

export const getAllExercise = async () => {
    return await exerciseQuestion.find({ isDeleted: false });
};

// export const getCourseEventsByUser = async (userId: string) => {
//     return await CourseEvent.find({ createdBy: userId, isDeleted: false });
// };



export const createExerciseQuestionWithAnswers = async (trainingPartId:string, data: {
  title: string;
  question: string;
  description?: string;
  answers: { content: string; isCorrect: boolean }[];
}, currentUserId: string) => {
  const { title, question, description, answers } = data;

  const exerciseQuestion = new ExerciseQuestion({
    title,
    question,
    description,
    changedBy: currentUserId || 'SYSTEM',
    trainingPart: trainingPartId,
    isDeleted: false
  });

  const savedQuestion = await exerciseQuestion.save();

  const answerDocs: IAnswer[] = [];
  for (const answer of answers) {
    const newAnswer = new Answer({
      content: answer.content,
      isCorrect: answer.isCorrect,
      exerciseQuestion: savedQuestion._id,
      isDeleted: false,
      changedBy: currentUserId || 'SYSTEM'
    });
    const savedAnswer = await newAnswer.save();
    answerDocs.push(savedAnswer);
  }


    const answerIds: Types.ObjectId[] = answerDocs.map(ans => ans._id as Types.ObjectId);
    savedQuestion.answers = answerIds;

    await savedQuestion.save();

    return {
        question: savedQuestion,
        answers: answerDocs
    };
};

// export const getExerciseQuestionsByTrainingPart = async (trainingPartId: string) => {
//   return await ExerciseQuestion.find({ trainingPart: trainingPartId, isDeleted: false }).populate('answers');
// };

export const getExerciseByTrainingPart = async (trainingPartId: string) => {
    const exerciseQuestions = await ExerciseQuestion.find({ trainingPart: trainingPartId }).populate('answers');
  
    return exerciseQuestions.map(exercise => ({
      id: exercise._id!.toString(),
      questionText: exercise.question,
      answers: (exercise.answers || []).map((ans: any) => ({
        content: ans.content,
        isCorrect: ans.isCorrect,
      }))
    }));
};

export const getExerciseQuestionById = async (id: string) => {
  const question = await ExerciseQuestion.findById(id).populate('answers');
  if (!question || question.isDeleted) throw new Error('Câu hỏi không tồn tại');
  return question;
};
