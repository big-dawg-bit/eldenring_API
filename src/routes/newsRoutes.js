import express from 'express';
import {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
} from '../controllers/newsController.js';
import {
    validateNews,
    validateId,
    validatePagination,
    validateSearch
} from '../middleware/validators.js';

const router = express.Router();

router.get('/', validatePagination, validateSearch, getAllNews);

router.get('/:id', validateId, getNewsById);

router.post('/', validateNews, createNews);

router.put('/:id', validateId, validateNews, updateNews);

router.delete('/:id', validateId, deleteNews);

export default router;