import { FastifyInstance } from 'fastify'
import { createUser } from '../controllers/create';
import { deleteUser } from '../controllers/delete';
import { updateUser } from '../controllers/update';
import { findUserById } from '../controllers/find-user-by-id';
import { findAllUser } from '../controllers/find-all-user';
import { signin } from '../controllers/signin';

export async function userRoutes(app: FastifyInstance) {
    app.post('/user', createUser);
    app.delete('/user/:id', deleteUser);
    app.put('/user/:id', updateUser);
    app.get('/user/:id', findUserById);
    app.get('/user', findAllUser);
    app.post('/user/signin', signin);
}