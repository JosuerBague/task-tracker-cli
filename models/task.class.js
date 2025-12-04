const TASK_STATE = require('../constants/tak-state.constant.js');
const Logger = require('../utils/logger.class.js');
const fs = require('fs');
const path = require('path');
const taskDbPath = path.resolve(__dirname, '..', 'task-db.json');

class Task {
    static logger = Logger;
    
    static ensureDbExists() {
        fs.access(taskDbPath, fs.constants.F_OK, (err) => {
                if (err) {
                    try {
                        this.logger.warn(`"task-db.json" file was not found. Creating new task-db.json file`)
                        fs.writeFileSync(taskDbPath, JSON.stringify({}, null, 2));
                        this.logger.success(`Database successfully created`)
                    } catch (error) {
                        this.logger.error(`An error occurred while trying to create the database file: ${error}`)
                    }
                } 
            })
    }

    static addTask(args) {
        try {
            const dbEntries = JSON.parse(fs.readFileSync(taskDbPath));
            const existingIds = Object.keys(dbEntries);
            const lastId = Number(existingIds[existingIds.length - 1] ?? 0);
            const nextId = lastId + 1;

            const newTask = {
                id: nextId,
                description: args.join(' '),
                status: TASK_STATE.TODO,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            dbEntries[nextId] = newTask;

            fs.writeFileSync(taskDbPath, JSON.stringify(dbEntries, null, 2));
            this.logger.success(`Task added successfully (ID: ${nextId})`);

        } catch (error) {
            this.logger.error(`An error ocurred while trying to add the task: ${args.join(' ')}.\nError: ${error}`);
        }
    }
}

module.exports = Task;
