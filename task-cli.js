const CLI_ACTIONS = require('./constants/cli-actions.constant.js')
const readline = require('readline');
const Task = require('./models/task.class.js')
const path = require('path');
const fs = require('fs');
const { stringify } = require('querystring');

const taskDbPath = path.join(__dirname, 'task-db.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


function waitForUserInput() {
    return new Promise((resolve) => {
        rl.question('', (input) => {
            resolve(input.trim())
        })
    })
}

function printUnknownCommand() {
    console.log('\nYou have entered an unknown command.\n')
}


function dispatcher(action, args) {
    switch(action) {
        case CLI_ACTIONS.ADD: {
            Task.addTask(args.join(' '))
            break;
        }
        case CLI_ACTIONS.UPDATE: {
            Task.updateTask(args[0], args.slice(1).join(' '));
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
        Task.ensureDbExists();

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
