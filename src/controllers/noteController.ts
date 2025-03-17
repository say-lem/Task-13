import { Request, Response, NextFunction } from 'express';
import Note from '../models/noteModel';
import Category from '../models/categoryModel';
import { NotFoundError, BadRequestError } from '../utils/errorClasses';
import { CreateNoteRequest, UpdateNoteRequest } from '../interfaces/noteInterface';

// Get all notes
export const getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await Note.find().populate('category', 'name color').sort({ updatedAt: -1 }).lean();
    res.status(200).json({ status: 'success', results: notes.length, data: { notes } });
  } catch (error) {
    next(error);
  }
};

// Get a specific note
export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findById(req.params.id).populate('category', 'name color').lean();
    if (!note) throw new NotFoundError(`Note with ID ${req.params.id} not found`);
    res.status(200).json({ status: 'success', data: { note } });
  } catch (error) {
    next(error);
  }
};

// Create a new note
export const createNote = async (req: Request<{}, {}, CreateNoteRequest>, res: Response, next: NextFunction) => {
  try {
    const { title, content, categoryId } = req.body;
    if (!title || !content) throw new BadRequestError('Title and content are required');
    
    if (categoryId) {
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) throw new BadRequestError(`Category with ID ${categoryId} not found`);
    }
    
    const newNote = await Note.create({ title, content, category: categoryId || null });
    const populatedNote = await Note.findById(newNote._id).populate('category', 'name color');
    
    res.status(201).json({ status: 'success', data: { note: populatedNote } });
  } catch (error) {
    next(error);
  }
};

// Update a note
export const updateNote = async (req: Request<{ id: string }, {}, UpdateNoteRequest>, res: Response, next: NextFunction) => {
  try {
    const { title, content, categoryId } = req.body;
    
    if (categoryId) {
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) throw new BadRequestError(`Category with ID ${categoryId} not found`);
    }
    
    const updateData: UpdateNoteRequest = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).populate('category', 'name color');
    if (!updatedNote) throw new NotFoundError(`Note with ID ${req.params.id} not found`);
    
    res.status(200).json({ status: 'success', data: { note: updatedNote } });
  } catch (error) {
    next(error);
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) throw new NotFoundError(`Note with ID ${req.params.id} not found`);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

// Get notes by category
export const getNotesByCategory = async (req: Request<{ categoryId: string }>, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    const categoryExists = await Category.exists({ _id: categoryId });
    if (!categoryExists) throw new NotFoundError(`Category with ID ${categoryId} not found`);
    
    const notes = await Note.find({ category: categoryId }).populate('category', 'name color').sort({ updatedAt: -1 });
    res.status(200).json({ status: 'success', results: notes.length, data: { category: categoryId, notes } });
  } catch (error) {
    next(error);
  }
};
