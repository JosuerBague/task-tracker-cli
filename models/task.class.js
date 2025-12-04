const TASK_STATE = require('../constants/tak-state.constant.js');
const Logger = require('../utils/logger.class.js');
const fs = require('fs');
const path = require('path');
const taskDbPath = path.resolve(__dirname, '..', 'task-db.json');

class Task {
    static logger = Logger;
    static dbPath = taskDbPath;
    
    static ensureDbExists() {
        fs.access(this.dbPath, fs.constants.F_OK, (err) => {
                if (err) {
                    try {
                        this.logger.warn(`"task-db.json" file was not found. Creating new task-db.json file`)
                        this.#saveTask({})
                        this.logger.success(`Database successfully created`)
                    } catch (error) {
                        this.logger.error(`An error occurred while trying to create the database file: ${error}`)
                    }
                } 
            })
    }

    static #getTasks() {
        try {
            const dbEntries = JSON.parse(fs.readFileSync(this.dbPath));
            return dbEntries;
        } catch (error) {
            this.logger.error('An error occurred while trying to read existing tasks')
            throw error;
        }
    }

    static #saveTask(newTasks) {
        try {
            fs.writeFileSync(this.dbPath, JSON.stringify(newTasks, null, 2));
        } catch (error) {
            throw error;
        }
    }

    static addTask(task) {
        try {
            const dbEntries = this.#getTasks();
            const existingIds = Object.keys(dbEntries);
            const lastId = Number(existingIds[existingIds.length - 1] ?? 0);
            const nextId = lastId + 1;

            const newTask = {
                id: nextId,
                description: task,
                status: TASK_STATE.TODO,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            dbEntries[nextId] = newTask;

            this.#saveTask(dbEntries);
            this.logger.success(`Task added successfully (ID: ${nextId})`);
        } catch (error) {
            this.logger.error(`An error ocurred while trying to add the task: ${task}.\nError: ${error}`);
        }
    }

    static updateTask(taskId, task) {
        try {
            const dbEntries = this.#getTasks();
            const match = dbEntries[taskId];

            if (!match) {
                throw new Error(`Unable to find task with ID: ${taskId}`);
            }

            dbEntries[taskId].description = task;
            this.#saveTask(dbEntries);
            this.logger.success(`Task with ID: ${taskId} has been updated to "${task}"`)
        } catch (error) {
            this.logger.error(error)
        }
    }
}

module.exports = Task;
