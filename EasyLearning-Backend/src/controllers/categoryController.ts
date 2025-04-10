import { toCourseResponse } from '../mapper/courseMapper';
import Category from '../models/category';
import courseDetail from '../models/courseDetail';
import course from '../models/course';

export const getAllCategories = async () => {
  return await Category.find({ isDeleted: false }); 
};

export const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);
  if (!category || category.isDeleted) throw new Error('Danh mục không tồn tại');
  return category;
};

export const findTop4BySortOrderNotNull = async () => {
  const validSortOrders = [1, 2, 3, 4];
  const categories = await Category.find({
    sortOrder: { $in: validSortOrders }
  });

  return categories;
};


export const getAllCategoryWithCourse = async () => {
  const categories = await Category.find();
  const result: any[] = [];
  for (const category of categories) {
    const courseDetails = await courseDetail.find({ categoryId: category._id });
    const courseIds = courseDetails.map(p => p.course._id);
    const courses = await course.find({ _id: { $in: courseIds } });
    const courseResponses = courses.map(toCourseResponse); 

    result.push({
      id: category._id!.toString(),
      categoryName: category.categoryName,
      courses: courseResponses
    });
  }
  return result;
};


export const getCategoryWithCourse = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    return null; 
  }

  const courseDetails = await courseDetail.find({ categoryId: category._id });
  const courseIds = courseDetails.map(p => p.course._id); 
  const courses = await course.find({ _id: { $in: courseIds } });

  const courseResponses = courses.map(toCourseResponse);

  return {
    id: category._id!.toString(),
    categoryName: category.categoryName,
    courses: courseResponses
  };
};


export const createCategory = async (data: any) => {
    const newCategory = new Category({
        categoryName: data.categoryName,
        imageUrl: data.imageUrl || '',
        sortOrder: data.sortOrder || 0,
        changedBy: data.changedBy || 'SYSTEM',
        isDeleted: false,
      });
  
    return await newCategory.save();
};
  
export const updateCategory = async (id: string, data: any) => {
    const category = await Category.findById(id);
    if (!category || category.isDeleted) throw new Error('Danh mục không tồn tại');
    category.categoryName = data.categoryName ?? category.categoryName;
    category.imageUrl = data.imageUrl ?? category.imageUrl;
    category.sortOrder = data.sortOrder ?? category.sortOrder;
    category.changedBy = data.changedBy || 'SYSTEM';
    return await category.save();
};

export const softDeleteCategory = async (id: string) => {
  const category = await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!category) throw new Error('Danh mục không tồn tại');
  return category;
};

export const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new Error('Danh mục không tồn tại');
  return category;
};
