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
            } 
            if ((title && !description) || (!title && description)){
                return res
                    .writeHead(400) //bad request
                    .end('Por favor, insira title e description para pesquisar!');
            } 
            return res
                .writeHead(200)
                .end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {title, description} = req.body;
            const {id} = req.params;
            const index = tasks.findIndex(task => task.id === id);
            
            if (index > -1) {
                if (title || description) {
                    tasks[index].title = title;
                    tasks[index].description = description;
                    return res
                        .writeHead(200)
                        .end('Mudança realizada com sucesso!')
                }
                return res
                    .writeHead(400)
                    .end('Sem dados para modificar.')
            }
            return res
                .writeHead(404)
                .end(`Não existe tarefa com o id ${id}`);
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params;
            const index = tasks.findIndex(task => task.id === id);

            if (index > -1) {
                tasks.pop(index);
                return res
                    .writeHead(200)
                    .end('Task deletada com sucesso')
            }
            return res
                .writeHead(404)
                .end(`Não existe tarefa com o id ${id}`);
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const {id} = req.params;
            const index = tasks.findIndex(task => task.id === id);

            if (index > -1) {
                tasks[index].completed_at = new Date();
                return res
                    .writeHead(200)
                    .end(JSON.stringify(tasks));
            }
            return res
                .writeHead(404)
                .end(`Não existe tarefa com o id ${id}`);
        }
    }
]