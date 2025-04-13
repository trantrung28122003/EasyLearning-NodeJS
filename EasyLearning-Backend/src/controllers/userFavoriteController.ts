import Course from '../models/course';
import UserFavorite from '../models/userFavorite';

const getFavoriteCoursesByUserId = async (userId: string) => {
    try {

        const favorites = await UserFavorite.find({ user: userId, isDeleted: false });

        const courseIds = favorites.map(fav => fav.course._id);

       
        const courses = await Course.find({ _id: { $in: courseIds }, isDeleted: false });

        return courses;
    } catch (error: any) {
        console.error('Lỗi khi lấy danh sách khóa học yêu thích:', error.message);
        throw new Error('Không thể lấy danh sách khóa học yêu thích.');
    }
};


const toggleFavorite = async (courseId :string, currentUserId: string) => {
    try {
        
        const existingFavorite = await UserFavorite.findOne({ user: currentUserId, course: courseId });

        if (existingFavorite) {
          
            await UserFavorite.deleteOne({ user: currentUserId, course: courseId });
            return false;
        }
        const userFavorite = new UserFavorite({
            course: courseId,
            user: currentUserId,
            changedBy: currentUserId,
        });
        await userFavorite.save();
        return true;
    } catch (error : any) {
        console.error('yêu thích khóa học bị lỗi nè con:', error.message);
        throw new Error('Lỗi khi thêm yêu thích khóa học.');
    }
};

export { getFavoriteCoursesByUserId, toggleFavorite };
