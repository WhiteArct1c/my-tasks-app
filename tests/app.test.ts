import request from 'supertest';
import app from '../src/index';

describe('Tasks API', () => {
    let createdTaskId: number;

    it('should list all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    it('should get a single task by ID', async () => {
        const response = await request(app).get('/tasks/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('description', 'Buy groceries');
        expect(response.body).toHaveProperty('done', false);
    });

    it('should return 404 for a non-existent task', async () => {
        const response = await request(app).get('/tasks/999');
        expect(response.statusCode).toBe(404);
    });

    it('should create a new task', async () => {
        const newTask = { description: 'Test task', done: false };
        const response = await request(app).post('/tasks').send(newTask);
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject(newTask);
        createdTaskId = response.body.id;
    });

    it('should update an existing task', async () => {
        const updatedTask = { description: 'Updated task', done: true };
        const response = await request(app).put(`/tasks/${createdTaskId}`).send(updatedTask);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(updatedTask);
    });

    it('should delete a task', async () => {
        const response = await request(app).delete(`/tasks/${createdTaskId}`);
        expect(response.statusCode).toBe(204);
    });

    it('should return 404 for a deleted task', async () => {
        const response = await request(app).get(`/tasks/${createdTaskId}`);
        expect(response.statusCode).toBe(404);
    });

    it('should mark a task as complete', async () => {
        const newTask = { description: 'Test task', done: false };
        const response = await request(app).post('/tasks').send(newTask);
        const taskId = response.body.id;

        const patchResponse = await request(app).patch(`/tasks/${taskId}`);
        expect(patchResponse.statusCode).toBe(200);
        expect(patchResponse.body).toHaveProperty('done', true);

        const getResponse = await request(app).get(`/tasks/${taskId}`);
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body).toHaveProperty('done', true);
    });
});
