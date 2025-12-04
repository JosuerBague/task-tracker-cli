const readline = require('readline');
const path = require('path');
const fs = require('fs');
const { stringify } = require('querystring');

const taskDbPath = path.join(__dirname, 'task-db.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function ensureDbExists() {
    fs.access(taskDbPath, fs.constants.F_OK, (err) => {
        if (err) {
            try {
                console.log(`\n"task-db.json" file was not found.\nCreating new task-db.json file`)
                fs.writeFileSync(taskDbPath, JSON.stringify({}, null, 2));
                console.log(`\nDatabase successfully created`)
            } catch (error) {
                console.log(`\nAn error occurred while trying to create the database file: ${error}`)
            }
        } 
    })
}

function waitForUserInput() {
    return new Promise((resolve) => {
        rl.question('', (input) => {
            resolve(input.trim())
        })
    })
}

const ACTIONS = {
    ADD: 'add',
}

const TASK_STATE = {
    TODO: 'todo',
    IN_PROGRESS: 'in-progress',
    DONE: 'done'
}

function printUnknownCommand() {
    console.log('\nYou have entered an unknown command.\n')
}

function addNewTask(args) {

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
        console.log(`Task added successfully (ID: ${nextId})`);

    } catch (error) {
        console.log(`An error ocurred while trying to add the task: ${args.join(' ')}.\nError: ${error}`);
    }
}

function dispatcher(action, args) {
    switch(action) {
        case ACTIONS.ADD: {
            console.log('I AM INSIDE ADD')
            addNewTask(args)
            break;
        }
        default: {
            printUnknownCommand();
            break;
        }
    }
}

async function main() {
    // Check if user passed in a command on cli startup
    // const input = process.argv.slice(2);

    try {
        ensureDbExists();

        let userInput;
        while (userInput !== 'quit') {
            userInput = await waitForUserInput();

            const [act, ...args] = userInput.split(' ');
            dispatcher(act, args)
        }

        rl.close();
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

if (require.main === module) {
    main();
}
