import { parse } from "csv-parse";
import fs from "node:fs";

const filePath = new URL("../../data.csv", import.meta.url);

const importCSV = async () => {
  //const records = [];
  const parser = fs
    .createReadStream(filePath)
    .setEncoding("utf8")
    .pipe(parse({}));

  let count = 0;

  for await (let chunk of parser) {
    const [title, description] = chunk;

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
};

(async () => {
  //const records = await importCSV();
  await importCSV();
  //console.info(records);
})();