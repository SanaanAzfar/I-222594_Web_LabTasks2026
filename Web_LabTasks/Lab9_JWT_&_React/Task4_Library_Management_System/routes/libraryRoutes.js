import express from 'express';
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    createBook,
    getBooks,
    updateBook,
    deleteBook,
} from '../controllers/libraryController.js';

const router = express.Router();

// Category routes
router.post('/api/categories', createCategory);
router.get('/api/categories', getCategories);
router.put('/api/categories/:id', updateCategory);
router.delete('/api/categories/:id', deleteCategory);

// Book routes
router.post('/api/books', createBook);
router.get('/api/books', getBooks);
router.put('/api/books/:id', updateBook);
router.delete('/api/books/:id', deleteBook);

export default router;