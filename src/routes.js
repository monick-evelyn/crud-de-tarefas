import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from "node:crypto";
import { StatusCodes } from "http-status-codes";

let tasks = [];
let tasksfiltered = [];
export const routes = [
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            if (req.body) {
                const { title, description } = req.body;
                if (title && description) {
                    tasks.push({
                        id: randomUUID(),
                        title,
                        description,
                        completed_at: null,
                        created_at: new Date(),
                        updated_at: new Date(),
                    });
                    console.log(tasks);
                    //tasks.push(task);
                    return res
                        .writeHead(StatusCodes.CREATED)
                        .end("Tarefa criada com sucesso!");
                }
                return res
                    .writeHead(StatusCodes.BAD_REQUEST)
                    .end("Por favor, insira title e description para criar task");
            }
            return res
                .writeHead(StatusCodes.BAD_REQUEST)
                .end("Por favor, insira um body na requisição!");
        },
    },
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const { title, description } = req.query;
            if (title && description) {
                tasksfiltered = tasks.filter(
                    (task) => task.title === title && task.description === description
                );
                console.log(tasksfiltered);
                return res
                    .setHeader("Content-type", "aplication/json")
                    .writeHead(StatusCodes.OK)
                    .end(JSON.stringify(tasksfiltered));
            }
            if ((title && !description) || (!title && description)) {
                return res
                    .writeHead(StatusCodes.BAD_REQUEST) //bad request
                    .end("Por favor, insira title e description para pesquisar!");
            }
            return res.writeHead(StatusCodes.OK).end(JSON.stringify(tasks));
        },
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params;
            const index = tasks.findIndex((task) => task.id === id);
            if (index > -1) {
                if (req.body) {
                    const { title, description } = req.body;
                    if (title && description) {
                        tasks[index].title = title;
                        tasks[index].description = description;
                        return res
                            .writeHead(StatusCodes.OK)
                            .end("Mudança realizada com sucesso!");
                    }

                    if (title && !description) {
                        tasks[index].title = title;
                        return res
                            .writeHead(StatusCodes.OK)
                            .end("Mudança realizada com sucesso!");
                    }

                    if (!title && description) {
                        tasks[index].description = description;
                        return res
                            .writeHead(StatusCodes.OK)
                            .end("Mudança realizada com sucesso!");
                    }
                    return res
                        .writeHead(StatusCodes.BAD_REQUEST)
                        .end(
                            "Sem dados para modificar, por favor insira title ou description"
                        );
                }

                return res
                    .writeHead(StatusCodes.BAD_REQUEST)
                    .end("Por favor, insira um body na requisição!");
            }
            return res
                .writeHead(StatusCodes.NOT_FOUND)
                .end(`Não existe tarefa com o id ${id}`);
        },
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params;
            const index = tasks.findIndex((task) => task.id === id);

            if (index > -1) {
                tasks.pop(index);
                return res.writeHead(StatusCodes.OK).end("Task deletada com sucesso");
            }
            return res
                .writeHead(StatusCodes.NOT_FOUND)
                .end(`Não existe tarefa com o id ${id}`);
        },
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/complete"),
        handler: (req, res) => {
            const { id } = req.params;
            const index = tasks.findIndex((task) => task.id === id);

            if (index > -1) {
                tasks[index].completed_at = new Date();
                return res.writeHead(StatusCodes.OK).end(JSON.stringify(tasks));
            }
            return res
                .writeHead(StatusCodes.BAD_REQUEST)
                .end(`Não existe tarefa com o id ${id}`);
        },
    },
];
