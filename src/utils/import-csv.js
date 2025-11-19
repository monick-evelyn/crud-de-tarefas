import { parse } from "csv-parse";
import fs from "node:fs";

const filePath = new URL("../../data.csv", import.meta.url);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const importCSV = async () => {
  //const records = [];
  const parser = fs
    .createReadStream(filePath)
    .setEncoding("utf8")
    .pipe(parse({}));

  let count = 0;

  for await (let chunk of parser) {
    const [title, description] = chunk;

    // mostrar que a stream está carregando (visual)
    console.log('carregando linha', count, '...');

    // pequena pausa para visualizar a stream sendo carregada
    await sleep(500);

    console.log(title, description);

    if (count > 0) {
      fetch("http://localhost:3335/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description }),
        //duplex: "half",
      });
    }
    count++;
  }
}

(async () => {
  //const records = await importCSV();
  await importCSV();
  //console.info(records);
})();