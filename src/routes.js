import { buildRoutePath } from "./utils/build-route-path.js"

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {title, description} = req.body;
            const task = {
                id: '1',
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }
            console.log(task);
            return res.writeHead(201).end();
        }
    },
]