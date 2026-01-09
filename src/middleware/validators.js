import { body, param, query, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

export const validateBoss = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters')
        .matches(/^[a-zA-Z\s,'-]+$/).withMessage('Name can only contain letters, spaces, commas, hyphens and apostrophes'),
    
    body('title')
        .optional()
        .trim()
        .isLength({ max: 255 }).withMessage('Title must be less than 255 characters')
        .custom((value) => {
            if (value && value.length > 0 && value.length < 3) {
                throw new Error('Title must be at least 3 characters if provided');
            }
            return true;
        }),
    
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters')
        .custom((value) => {
            const meaningfulContent = value.replace(/[\s.,!?;:]+/g, '');
            if (meaningfulContent.length < 5) {
                throw new Error('Description must contain meaningful content');
            }
            return true;
        }),
    
    body('location')
        .optional()
        .trim()
        .isLength({ max: 255 }).withMessage('Location must be less than 255 characters')
        .matches(/^[a-zA-Z\s,'-]+$/).withMessage('Location can only contain letters, spaces, commas, hyphens and apostrophes'),
    
    body('difficulty')
        .notEmpty().withMessage('Difficulty is required')
        .isInt({ min: 1, max: 5 }).withMessage('Difficulty must be a number between 1 and 5')
        .custom((value) => {
            const validDifficulties = [1, 2, 3, 4, 5];
            if (!validDifficulties.includes(parseInt(value))) {
                throw new Error('Difficulty must be exactly 1, 2, 3, 4, or 5');
            }
            return true;
        }),
    
    body('health')
        .optional()
        .isInt({ min: 1, max: 999999 }).withMessage('Health must be a positive number between 1 and 999,999')
        .custom((value) => {
            if (value && value < 100) {
                throw new Error('Boss health should be at least 100 HP (this is a boss, not a regular enemy!)');
            }
            return true;
        }),
    
    body('drops')
        .optional()
        .trim()
        .isLength({ max: 255 }).withMessage('Drops must be less than 255 characters'),
    
    body('order')
        .optional()
        .isInt({ min: 0, max: 999 }).withMessage('Order must be a positive number between 0 and 999'),
    
    validate
];

export const validateNews = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 255 }).withMessage('Title must be between 5 and 255 characters')
        .custom((value) => {
            if (value === value.toUpperCase() && value.length > 10) {
                throw new Error('Title should not be entirely in uppercase');
            }
            return true;
        }),
    
    body('content')
        .trim()
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 20, max: 10000 }).withMessage('Content must be between 20 and 10,000 characters')
        .custom((value) => {
            const meaningfulContent = value.replace(/[\s.,!?;:\n\r]+/g, '');
            if (meaningfulContent.length < 15) {
                throw new Error('Content must contain meaningful text, not just punctuation and spaces');
            }
            return true;
        }),
    
    body('publication_date')
        .optional()
        .isISO8601().withMessage('Publication date must be a valid date in ISO 8601 format')
        .custom((value) => {
            if (value) {
                const pubDate = new Date(value);
                const now = new Date();
                const maxFutureDate = new Date();
                maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
                
                const minPastDate = new Date();
                minPastDate.setFullYear(minPastDate.getFullYear() - 5);
                
                if (pubDate < minPastDate) {
                    throw new Error('Publication date cannot be more than 5 years in the past');
                }
                
                if (pubDate > maxFutureDate) {
                    throw new Error('Publication date cannot be more than 1 year in the future');
                }
            }
            return true;
        }),
    
    body('user_id')
        .notEmpty().withMessage('User ID is required')
        .isInt({ min: 1 }).withMessage('User ID must be a valid positive number')
        .custom((value) => {
            if (value > 999999) {
                throw new Error('User ID seems invalid (too large)');
            }
            return true;
        }),
    
    validate
];

export const validateId = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID must be a valid positive number'),
    validate
];

export const validatePagination = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    
    query('offset')
        .optional()
        .isInt({ min: 0 }).withMessage('Offset must be a positive number or zero'),
    
    validate
];

export const validateSearch = [
    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Search query must be between 1 and 100 characters')
        .custom((value) => {
            // Prevent SQL injection attempts
            if (value && /[;<>{}]/g.test(value)) {
                throw new Error('Search query contains invalid characters');
            }
            return true;
        }),
    
    validate
];

export const validateDifficultyFilter = [
    query('difficulty')
        .optional()
        .isInt({ min: 1, max: 5 }).withMessage('Difficulty filter must be between 1 and 5'),
    
    validate
];