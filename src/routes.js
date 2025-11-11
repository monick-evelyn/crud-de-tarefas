import { buildRoutePath } from "./utils/build-route-path.js"
import {randomUUID} from 'node:crypto'

let tasks = []
let tasksfiltered = [];
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
            const {title, description} = req.query;
            if (title && description) {
                tasksfiltered = tasks.filter(task => task.title === title && task.description === description);
                console.log(tasksfiltered);
                return res
                .setHeader('Content-type', 'aplication/json')
                .end(JSON.stringify(tasksfiltered))
            } else if ((title && !description) || (!title && description)){
                return res
                    .writeHead(400) //bad request
                    .end('Por favor, insira title e description para pesquisar!');
            } else {
                return res
                    .end(JSON.stringify(tasks))
            }
        }
    },
]