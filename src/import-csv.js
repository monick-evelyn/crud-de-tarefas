import {parse} from "csv-parse";
import fs from "fs";
import { Transform, Writable } from "node:stream";

const readableStream = fs.createReadStream('src/data.csv').pipe(
    parse({
        delimiter: ",",
        from_line: 2,
    })
)

const transformStreamToObj = new Transform({
    objectMode:true,
    transform(chunk, encoding, callback) {
        const [title, description] = chunk;
        callback(null, {title, description});
    }
})

const transformStreamToString = new Transform({
    objectMode:true, 
    transform(chunk, encoding, callback) {
        callback(null, JSON.stringify(chunk))
    },
})

const writableStream = new Writable({
    write(chunk, encoding, callback) {
        const string = chunk.toString();
        const data = JSON.parse(string);
        console.log(data);
        callback();
    }
})

readableStream
    .pipe(transformStreamToObj)
    .pipe(transformStreamToString)
    .pipe(writableStream)
    .on('close', () => console.log("finalizou", Date()));
