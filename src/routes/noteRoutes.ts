import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNotesByCategory
} from '../controllers/noteController';
import { validateRequest, validateNote, validateNoteUpdate } from '../middleware/validationMiddleware';
import { requestLogger } from '../middleware/loggingMiddleware';
import { authenticateUser } from '../middleware/authMiddleware'; 

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         categoryId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: integer
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Retrieve all notes
 *     description: Retrieve a list of all notes sorted by last updated.
 *     security:
 *       - BearerAuth: []
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: A list of notes
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.route('/')
  .get(authenticateUser, getAllNotes)
  /**
   * @swagger
   * /api/notes:
   *   post:
   *     summary: Create a new note
   *     description: Create a new note with title and content.
   *     security:
   *       - BearerAuth: []
   *     tags: [Notes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - content
   *             properties:
   *               title:
   *                 type: string
   *               content:
   *                 type: string
   *     responses:
   *       201:
   *         description: Note created successfully
   *       401:
   *         description: Unauthorized - Invalid or missing token
   */
  .post(authenticateUser, validateRequest(validateNote), createNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a specific note
 *     security:
 *       - BearerAuth: []
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.route('/:id')
  .get(authenticateUser, getNoteById)
  .delete(authenticateUser, deleteNote)
  .patch(authenticateUser, validateRequest(validateNoteUpdate), updateNote);

/**
 * @swagger
 * /api/notes/categories/{categoryId}:
 *   get:
 *     summary: Retrieve notes by category
 *     security:
 *       - BearerAuth: []
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notes in the specified category
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.route('/categories/:categoryId')
  .get(authenticateUser, getNotesByCategory);

export default router;
