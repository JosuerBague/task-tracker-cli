const TASK_STATE = require('../constants/tak-state.constant.js');
const Logger = require('../utils/logger.class.js');
const TaskDatabase = require('./task-db.class.js');

class Task {
    static logger = Logger;
    static db = new TaskDatabase();
    
    static ensureDbExists() {
        this.db.ensureDbExists()
    }

    static #getTasks() {
        try {
            return this.db.getEntries()
        } catch (error) {
            this.logger.error('An error occurred while trying to read existing tasks')
            throw error;
        }
    }

    static #findTaskWithEntries(taskId) {
        const match = this.db.findByIdWithEntries(taskId)

        if (!match) {
            throw new Error(`Unable to find task with ID: ${taskId}`);
        }

        return match;
    }

    static #findAllByStatus(status) {
        if (!status) {
            return Object.values(this.#getTasks());
        }

        const taskStates = Object.values(TASK_STATE)
        if (!taskStates.includes(status)) {
            throw new Error(`Unknown modifier passed for list command. Valid values: ${taskStates.join(', ')}`)
        }

        return this.db.findAllByField('status', status);
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

            this.db.save(dbEntries);
            this.logger.success(`Task added successfully (ID: ${nextId})`);
        } catch (error) {
            this.logger.error(`An error ocurred while trying to add the task: ${task}. ${error}`);
        }
    }

    static updateTask(taskId, task) {
        try {
            const {dbEntries} = this.#findTaskWithEntries(taskId);
            dbEntries[taskId].description = task;
            this.db.save(dbEntries);
            this.logger.success(`Task with ID: ${taskId} has been updated to "${task}"`)
        } catch (error) {
            this.logger.error(error)
        }
    }

    static deleteTask(taskId) {
        try {   
            const { dbEntries } = this.#findTaskWithEntries(taskId)
            delete dbEntries[taskId];
            this.db.save(dbEntries);
            this.logger.success(`Task with ID: ${taskId} as been removed`);
        } catch (error) {
            this.logger.error(`An error occured while trying to delete the task with ID: ${taskId}. ${error}`)
        }
    }

    static updateTaskStatus(newStatus, taskId) {
        try {
            const { dbEntries } = this.#findTaskWithEntries(taskId)
            dbEntries[taskId].status = newStatus; 
            this.db.save(dbEntries);
            this.logger.success(`Task status set to ${newStatus} for task with ID: ${taskId}`)
        } catch (error) {
            this.logger.error(`An error occured while updating the task with ID: ${taskId}. ${error}`)
        }   
    }

    static listTasks(key) {
        try {
            const items = this.#findAllByStatus(key);
            let message = '\n\nID\t\tSTATUS\t\tTASK\n';
            items.map((item) => message = message + `\n#${item.id}\t\t${item.status}\t\t${item.description}`)
            message = message + `\n\nTOTAL - ${items.length}\n\n`;
            this.logger.info(message)
        } catch (error) {
            this.logger.error(`An error occured: ${error}`);
        }
    }
}

module.exports = Task;
