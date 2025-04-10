import CourseDetail from '../models/courseDetail';

export const createCourseDetail = async (courseId: string, categoryIds: string[], changedBy: string = 'SYSTEM') => {
  const courseDetails = categoryIds.map(categoryId => ({
    course: courseId,
    category: categoryId,
    changedBy,
    isDeleted: false
  }));
  return await CourseDetail.insertMany(courseDetails);
};

export const softDeleteDetailByCourseId = async (courseId: string) => {
  await CourseDetail.updateMany({ course: courseId }, { isDeleted: true });
};

export const softDeleteDetailByCategoryId = async (categoryId: string) => {
  await CourseDetail.updateMany({ category: categoryId }, { isDeleted: true });
};


export const deleteByCourseId = async (courseId: string) => {
    await CourseDetail.deleteMany({ course: courseId });
};
  
export const deleteByCategoryId = async (categoryId: string) => {
    await CourseDetail.deleteMany({ category: categoryId });
};