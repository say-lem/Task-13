import { CreateNoteRequest, UpdateNoteRequest } from '../interfaces/noteInterface';

// Type Guard for CreateNoteRequest
export const isCreateNoteRequest = (obj: any): obj is CreateNoteRequest => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.title === 'string' &&
    typeof obj.content === 'string' &&
    (obj.categoryId === undefined || typeof obj.categoryId === 'string')
  );
};

// Type Guard for UpdateNoteRequest
export const isUpdateNoteRequest = (obj: any): obj is UpdateNoteRequest => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (obj.title === undefined || typeof obj.title === 'string') &&
    (obj.content === undefined || typeof obj.content === 'string') &&
    (obj.categoryId === undefined || typeof obj.categoryId === 'string')
  );
};
