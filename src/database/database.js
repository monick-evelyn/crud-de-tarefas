import {readFile, writeFile} from 'node:fs/promises';
//import { title } from 'node:process';

const databasePath = new URL('./db.json', import.meta.url);

export class Database {
    #database = {};

    constructor(){
        this.#loadDatabase();
    }

    async #persist() {
        await writeFile(databasePath, JSON.stringify(this.#database, null, 2));
    }

    async #loadDatabase() {
    try {
      const data = await readFile(databasePath, { encoding: "utf-8" });
      this.#database = JSON.parse(data);
    } catch {
      this.#persist();
    }
  }

    select (table, search) {
        let data = this.#database[table] ?? [];

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase());
                })
            })
        }
        return data;
    }

    async insert (table, data) {
        if (Array.isArray(this.#database[table])){
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }
        await this.#persist();
    }
    
    async delete (table, id) { 
        const rowIndex = this.selectById(table, id); 

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1); 
            await this.#persist(); 
        }
    }

    async update (table, id, data) { 
        const row = this.selectById(table, id);

        // Garantir que `data` seja um objeto. Se vier como string JSON, tentar parsear.
        let updateData = data;
        if (typeof updateData === 'string') {
            try {
                updateData = JSON.parse(updateData);
            } catch (e) {
                updateData = {};
            }
        }

        console.log('Update data:', updateData);

        if (row > -1) {
            const existing = this.#database[table][row];

            const hasTitle = Object.prototype
            .hasOwnProperty.call(updateData, 'title') && 
            typeof updateData.title === 'string' && 
            updateData.title.trim() !== '';
            
            const hasDescription = Object.prototype
                .hasOwnProperty.call(updateData, 'description') && 
                typeof updateData.description === 'string' && 
                updateData.description.trim() !== '';

            this.#database[table][row] = {
                id,
                title: hasTitle ? updateData.title : existing.title,
                description: hasDescription ? updateData.description : existing.description,
                completed_at: existing.completed_at,
                created_at: existing.created_at,
                updated_at: new Date()
            };

            await this.#persist();
        }
    }

    async updateTaskCompleted (table, id) {
        const indexRow = this.selectById(table, id);

        if (indexRow > -1) {
            const existing = this.#database[table][indexRow];
            this.#database[table][indexRow] = {
                id,
                title: existing.title,
                description: existing.description,
                completed_at: new Date(),
                created_at: existing.created_at,
                updated_at: existing.updated_at
            };
            await this.#persist();
        }
    }

    selectById (table, id) { 
        const tableData = this.#database[table] ?? [];
        const rowIndex = tableData.findIndex(row => row.id === id);
        return rowIndex;
    }
}