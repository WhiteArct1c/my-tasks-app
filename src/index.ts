import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

interface Task {
    id: number;
    description: string;
    done: boolean;
}

let tasks: Task[] = [
    { id: 1, description: 'Buy groceries', done: false },
    { id: 2, description: 'Clean the house', done: true }
];

app.get('/tasks', (req: Request, res: Response) => {
    res.json(tasks);
});

app.get('/tasks/:id', (req: Request, res: Response) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found');
    res.json(task);
});

app.post('/tasks', (req: Request, res: Response) => {
    const { description, done }: { description: string; done?: boolean } = req.body;
    const newTask: Task = {
        id: tasks.length + 1,
        description,
        done: done || false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req: Request, res: Response) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found');

    const { description, done }: { description?: string; done?: boolean } = req.body;
    if (description) task.description = description;
    if (done !== undefined) task.done = done;

    res.json(task);
});

app.delete('/tasks/:id', (req: Request, res: Response) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) return res.status(404).send('Task not found');

    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

export default app;
