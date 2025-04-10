import LearningOutcomes, { ILearningOutcomes } from '../models/learningOutcomes'; 


export const getAllLearningOutcomes = async (): Promise<ILearningOutcomes[]> => {
    return await LearningOutcomes.find({ isDeleted: false });
};


export const getLearningOutcomeById = async (id: string) => {
    const learningOutcome = await LearningOutcomes.findById(id);
    if (!learningOutcome || learningOutcome.isDeleted) throw new Error('Learning outcome không tồn tại');
    return learningOutcome;
};


export const createLearningOutcome = async (data: any) => {
    const newLearningOutcome = new LearningOutcomes({
        outcomeName: data.outcomeName,
        courseId: data.courseId,
        changedBy: data.changedBy || 'SYSTEM',
    });
    return await newLearningOutcome.save();
};


export const updateLearningOutcome = async (id: string, data: any) => {
    const learningOutcome = await LearningOutcomes.findById(id);
    if (!learningOutcome || learningOutcome.isDeleted) throw new Error('Learning outcome không tồn tại');
    learningOutcome.outcomeName = data.outcomeName ?? learningOutcome.outcomeName;
    learningOutcome.changedBy = data.changedBy || 'SYSTEM';
    return await learningOutcome.save();
};


export const softDeleteLearningOutcome = async (id: string) => {
    const learningOutcome = await LearningOutcomes.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!learningOutcome) throw new Error('Learning outcome không tồn tại');
    return learningOutcome;
};


export const deleteLearningOutcome = async (id: string) => {
    const learningOutcome = await LearningOutcomes.findByIdAndDelete(id);
    if (!learningOutcome) throw new Error('Learning outcome không tồn tại');
    return learningOutcome;
};
