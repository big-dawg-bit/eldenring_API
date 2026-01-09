import express from 'express';
import {
    getAllBosses,
    getBossById,
    createBoss,
    updateBoss,
    deleteBoss
} from '../controllers/bossController.js';
import {
    validateBoss,
    validateId,
    validatePagination,
    validateSearch,
    validateDifficultyFilter
} from '../middleware/validators.js';

const router = express.Router();

router.get('/', validatePagination, validateSearch, validateDifficultyFilter, getAllBosses);

router.get('/:id', validateId, getBossById);

router.post('/', validateBoss, createBoss);

router.put('/:id', validateId, validateBoss, updateBoss);

router.delete('/:id', validateId, deleteBoss);

export default router;
