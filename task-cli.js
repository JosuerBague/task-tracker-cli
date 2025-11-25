const readline = require('readline');

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

async function main() {
    try {
        let userInput = await waitForUserInput()
        while (userInput !== 'quit') {
            console.log('This is the user input: ', userInput);
            userInput = await waitForUserInput()
        }

        rl.close();
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

if (require.main === module) {
    main();
}
