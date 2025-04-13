import { Router, Request, Response } from 'express';
import * as CategoryController from '../controllers/categoryController';
import * as constants from '../utils/constants';
import { responseSuccess, responseError } from '../utils/responseHandler';
import multer from 'multer';
import { handleImageUpload } from '../utils/uploadCloudinaryHandler';
import { check_authentication, check_authorization } from '../utils/authen';
import { HttpCode } from "../enums/httpCode";
const router = Router();
const upload = multer(); 

router.get('/', async (req: Request, res: Response) => {
    try {
        const categories = await CategoryController.getAllCategories();
        return responseSuccess(res, categories, 'Lấy danh sách category thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
});

router.get('/top-four-most-category', async (req: Request, res: Response) => {
  try {
    const result = await CategoryController.findTop4BySortOrderNotNull();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});
router.get('/get-all-category-with-course', async (req: Request, res: Response) => {
  try {
    const result = await CategoryController.getAllCategoryWithCourse();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/get-category-with-course', async (req: Request, res: Response) => {
  try {
    const categoryId = req.query.categoryId as string;
    const result = await CategoryController.getCategoryWithCourse(categoryId);
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});


router.post('/', check_authentication, check_authorization(constants.MOD_PERMISSION), upload.single('file'), async (req: Request, res: Response) => {
    try {
      const imageUrl = await handleImageUpload(req.file);
      const category = await CategoryController.createCategory({
        ...req.body,
        imageUrl,
        isDeleted: false,
      });
      return responseSuccess(res, category, 'Tạo category thành công');
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
});
  
router.put('/:categoryId', check_authentication, check_authorization(constants.MOD_PERMISSION), upload.single('file'), async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;
        let imageUrl: string | undefined;
        if (req.file) {
            imageUrl = await handleImageUpload(req.file);
        }
        const updatedCategory = await CategoryController.updateCategory(categoryId, {
            ...req.body,
            imageUrl,
        });
        return responseSuccess(res, updatedCategory, 'Cập nhật category thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
});

router.delete('/:categoryId', async (req: Request, res: Response) => {
    try {
      await CategoryController.deleteCategory(req.params.categoryId);
      return responseSuccess(res, null, 'Xoá category thành công');
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  });
  
router.delete('/soft-delete/:categoryId', check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
    try {
        await CategoryController.softDeleteCategory(req.params.categoryId);
        return responseSuccess(res, null, 'Xoá mềm category thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
});



export default router;
