const fs = require('fs');
const Logger = require('../utils/logger.class');
const path = require('path');
const taskDbPath = path.resolve(__dirname, '..', 'task-db.json');

class TaskDatabase {
    static logger = Logger;
    static dbPath = taskDbPath;

    constructor() {
        if (TaskDatabase.instance) {
            return TaskDatabase.instance;
        }
        
        TaskDatabase.instance = this;
    }

    ensureDbExists() {
         fs.access(TaskDatabase.dbPath, fs.constants.F_OK, (err) => {
            if (err) {
                try {
                    this.logger.warn(`"task-db.json" file was not found. Creating new task-db.json file`)
                    fs.writeFileSync(TaskDatabase.dbPath, JSON.stringify({}, null, 2))
                    this.logger.success(`Database successfully created`)
                } catch (error) {
                    this.logger.error(`An error occurred while trying to create the database file: ${error}`)
                }
            } 
        })
    }

    save(newValue) {
        try {
            fs.writeFileSync(TaskDatabase.dbPath, JSON.stringify(newValue, null, 2))
        } catch (error) {
            throw new Error('Failed to save to database')
        }
    }

    getEntries () {
        try {
            const dbEntries = JSON.parse(fs.readFileSync(TaskDatabase.dbPath));
            return dbEntries;
        } catch (error) {
            this.logger.error('An error occurred while retrieveing records')
            throw error;
        }
    }

    findByIdWithEntries(id) {
        const dbEntries = this.getEntries();
        const match = dbEntries[id];

        if (!match) {
            throw new Error('No record matched that id.')
        }

        return { match, dbEntries }
    }
    
    findAllByField(field, value) {
        const dbEntries = Object.values(this.getEntries());
        const matches = dbEntries.filter((it) => it[field] === value);

        return matches;
    }
}

module.exports = TaskDatabase;
