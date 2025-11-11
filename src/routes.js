import { buildRoutePath } from "./utils/build-route-path.js"
import {randomUUID} from 'node:crypto'

const tasks = []
export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {title, description} = req.body;
            tasks.push({
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            })
            console.log(tasks);
            //tasks.push(task);
            return res.writeHead(201).end('Tarefa criada com sucesso!');
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            return res
                .setHeader('Content-type', 'aplication/json')
                .end(JSON.stringify(tasks))
        }
    },
]