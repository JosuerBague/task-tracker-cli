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

const Actions = {
    add: 'add',
}

function printUnknownCommand() {
    console.log('\nYou have entered an unknown command.\n')
}

function addNewTask(args) {
    
}

function dispatcher(action, args) {
    switch(action) {
        case Actions.add: {
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
