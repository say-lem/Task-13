import { Response, NextFunction } from 'express';
import Note from '../models/noteModel';
import Category from '../models/categoryModel';
import { NotFoundError, BadRequestError } from '../utils/errorClasses';
import { CreateNoteRequest, UpdateNoteRequest } from '../interfaces/noteInterface';
import { AuthRequest } from "../middleware/authMiddleware";

// Get all notes for the logged-in user
export const getAllNotes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notes = await Note.find({ user: req.user?.userId })
      .populate('category', 'name color')
      .sort({ updatedAt: -1 })
      .lean();

    res.status(200).json({ status: 'success', results: notes.length, data: { notes } });
  } catch (error) {
    next(error);
  }
};

// Get a specific note but only if it belongs to the user
export const getNoteById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user?.userId })
      .populate('category', 'name color')
      .lean();

    if (!note) throw new NotFoundError(`Note with ID ${req.params.id} not found or unauthorized`);

    res.status(200).json({ status: 'success', data: { note } });
  } catch (error) {
    next(error);
  }
};

// Create a new note and assign it to the logged-in user
export const createNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, categoryId } = req.body;
    if (!title || !content) throw new BadRequestError('Title and content are required');

    if (categoryId) {
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) throw new BadRequestError(`Category with ID ${categoryId} not found`);
    }

    const newNote = await Note.create({ title, content, category: categoryId || null, user: req.user?.userId });
    const populatedNote = await Note.findById(newNote._id).populate('category', 'name color');

    res.status(201).json({ status: 'success', data: { note: populatedNote } });
  } catch (error) {
    next(error);
  }
};

// Update a note but only if it belongs to the user
export const updateNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, categoryId } = req.body;

    // Check if note exists and belongs to user
    const note = await Note.findOne({ _id: req.params.id, user: req.user?.userId });
    if (!note) throw new NotFoundError(`Note with ID ${req.params.id} not found or unauthorized`);

    if (categoryId) {
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) throw new BadRequestError(`Category with ID ${categoryId} not found`);
    }

    const updateData: UpdateNoteRequest = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('category', 'name color');

    res.status(200).json({ status: 'success', data: { note: updatedNote } });
  } catch (error) {
    next(error);
  }
};

// Delete a note but only if it belongs to the user
export const deleteNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user?.userId });

    if (!note) throw new NotFoundError(`Note with ID ${req.params.id} not found or unauthorized`);

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

// Get notes by category but only for the logged-in user
export const getNotesByCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    const categoryExists = await Category.exists({ _id: categoryId });

    if (!categoryExists) throw new NotFoundError(`Category with ID ${categoryId} not found`);

    const notes = await Note.find({ category: categoryId, user: req.user?.userId })
      .populate('category', 'name color')
      .sort({ updatedAt: -1 });

    res.status(200).json({ status: 'success', results: notes.length, data: { category: categoryId, notes } });
  } catch (error) {
    next(error);
  }
};
