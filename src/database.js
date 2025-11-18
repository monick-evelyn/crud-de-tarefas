import fs from 'node:fs/promises';
import { title } from 'node:process';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
    #database = {};

    constructor(){
        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data);
        }).catch(() => {
            this.#persist();
        });
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
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

    insert (table, data) {
        if (Array.isArray(this.#database[table])){
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }
        this.#persist();
    }
    
    delete (table, id) { 
        const rowIndex = this.#database[table].findIndex(row => row.id === id); 

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1); 
            this.#persist(); 
        }
    }

    update (table, id, data) { 
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

            this.#persist();
        }
    }

    selectById (table, id) { 
        const rowIndex = this.#database[table].findIndex(row => row.id === id); 
        return rowIndex;
    }
}