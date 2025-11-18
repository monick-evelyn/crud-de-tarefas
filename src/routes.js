import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from "node:crypto";
import { StatusCodes } from "http-status-codes";
import { Database } from "./database.js";
import { CLIENT_RENEG_WINDOW } from "node:tls";

const database = new Database();

export const routes = [
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            if (req.body) {
                const { title, description } = req.body;
                if (title && description) {
                    const task = {
                        id: randomUUID(),
                        title,
                        description,
                        completed_at: null,
                        created_at: new Date(),
                        updated_at: new Date(),
                    }
                    database.insert("tasks", task);
                    console.log(task);
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
                const tasks = database.select("tasks", (title && description) ? {
                    title,
                    description
                } : null);
                return res
                    .setHeader("Content-type", "application/json")
                    .writeHead(StatusCodes.OK)
                    .end(JSON.stringify(tasks));
            }
            if (title && !description || !title && description) {
                return res
                    .writeHead(StatusCodes.BAD_REQUEST) //bad request
                    .end("Por favor, insira title e description para pesquisar!");
            }
            const tasks = database.select("tasks");
            return res.writeHead(StatusCodes.OK).end(JSON.stringify(tasks));
        }
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const id = req.params.id;
            const row = database.selectById("tasks", id);
            console.log(`Row: ${row}`);
            //const index = tasks.findIndex((task) => task.id === id);
            if (row > -1) {
                if (req.body) {
                    const { title, description } = req.body;
                    if (title && description) {
                        database.update("tasks", id, { title, description });
                        return res
                            .writeHead(StatusCodes.OK)
                            .end("Mudança realizada com sucesso!");
                    }

                    if (title && !description) {
                        database.update("tasks", id, { title });
                        return res
                            .writeHead(StatusCodes.OK)
                            .end("Mudança realizada com sucesso!");
                    }

                    if (!title && description) {
                        database.update("tasks", id, { description });
                        return res
                            .writeHead(StatusCodes.OK)
                            .end("Mudança realizada com sucesso!");
                    }
                    return res
                        .writeHead(StatusCodes.BAD_REQUEST)
                        .end("Sem dados para modificar, por favor insira title ou description");
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
            const {id} = req.params;
            //const index = tasks.findIndex((task) => task.id === id);
            const index = database.selectById("tasks", id)

            if (index > -1) {
                //tasks.pop(index);
                database.delete("tasks", id);
                return res.writeHead(StatusCodes.OK).end("Task deletada com sucesso!");
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
