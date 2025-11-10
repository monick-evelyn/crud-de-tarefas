import http from 'node:http';
import {routes} from './routes.js';
import {json} from './middlewares/json.js';

const server = http.createServer(async (req, res) => {
    const {method, url} = req;
    console.log(method,url);

    await json(req, res);
    const route = routes.find(route => {
        return route.method === method && route.path.test(url);
    })

    if (route) {
        const routeParams = req.url.match(route.path);
        return route.handler(req, res)
    }
    return res.writeHead(404).end()
})

server.listen(3335)