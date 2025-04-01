import { FastifyInstance } from 'fastify'
import { createActivity } from '../controllers/create';
import { findAllActivity } from '../controllers/find-all-activity';
import { findActivityById } from '../controllers/find-activity-by-id';
import { updateActivity } from '../controllers/update-activity';
import { deleteActivity } from '../controllers/delete';
import { createWordSearchActivity } from '../controllers/create-word-search-activity';
import { createCrosswordActivity } from '../controllers/create-crossword-activity';
import { createQuizActivity } from '../controllers/create-quiz-activity';
import { createClozeActivity } from '../controllers/create-cloze-activity';
import { createDragDropActivity } from '../controllers/create-drag-drop-activity';
import { createMultipleChoiceActivity } from '../controllers/create-multiple-choice-activity';
import { publicActivity } from '../controllers/public-activity';
import { getPublicActivity } from '../controllers/get-public-activity';

export async function activityRoutes(app: FastifyInstance) {
    app.post('/activity', createActivity);
    app.get('/activity', findAllActivity);
    app.get('/activity/:id', findActivityById);
    app.post('/public/activity/:activityId', publicActivity);
    app.get('/public/activity', getPublicActivity);
    app.put('/activity/:id', updateActivity);
    app.delete('/activity/:id', deleteActivity);
    app.post('/activities/word_search', createWordSearchActivity);
    app.post('/activities/crossword', createCrosswordActivity);
    app.post('/activities/quiz', createQuizActivity);
    app.post('/activities/cloze', createClozeActivity);
    app.post('/activities/dragdrop', createDragDropActivity);
    app.post('/activities/multiplechoice', createMultipleChoiceActivity);    
}