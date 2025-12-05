const TASK_STATE = require('../constants/tak-state.constant')
const Logger = require("../utils/logger.class");
const TaskDatabase = require("./task-db.class");
const readline = require('readline');
const Task = require("./task.class");
const CLI_ACTIONS = require("../constants/cli-actions.constant");

class Tasker {
    constructor () {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        this.tasks = Task;
        this.logger = Logger;
        this.db = new TaskDatabase()
    }

    async start() {
        
        try {   
            this.db.ensureDbExists();

            let startMessage = '##### WELCOME TO TASKER #####\n\nCommands - \n';
            Object.values(CLI_ACTIONS).forEach(action => startMessage = startMessage + `- ${action}\n`)
            this.logger.display(startMessage)

            let userInput;
            while(userInput !== CLI_ACTIONS.QUIT) {
                this.logger.display('Waiting for input...')
                userInput = await this.#waitForUserInput();

                const [act, ...args] = userInput.split(' ')
                this.#dispatch(act, args)
            }

            this.rl.close();
        } catch (error) {
            this.logger.error(error)
        }
    }

    #waitForUserInput() {
        return new Promise((resolve) => {
            this.rl.question('', (input) => resolve(input.trim()))            
        })
    }

    #printUnknownCommand() {
        this.logger.warn('You have entered an unknown command.\n')
    }

    #dispatch(action, args) {
        switch(action) {
            case CLI_ACTIONS.ADD: {
                this.tasks.addTask(args.join(' '))
                break;
            }
            case CLI_ACTIONS.UPDATE: {
                this.tasks.updateTask(args[0], args.slice(1).join(' '));
                break;
            }
            case CLI_ACTIONS.DELETE: {
                this.tasks.deleteTask(args[0])
                break;
            }
            case CLI_ACTIONS.PROGRESS: {
                this.tasks.updateTaskStatus(TASK_STATE.IN_PROGRESS, args[0])
                break;
            }
            case CLI_ACTIONS.DONE: {
                this.tasks.updateTaskStatus(TASK_STATE.DONE, args[0])
                break;
            }
            case CLI_ACTIONS.LIST: {
                this.tasks.listTasks(args.join(' '));
                break;
            }
            default: {
                this.#printUnknownCommand();
                break;
            }
        }
    }
}

module.exports = Tasker;
