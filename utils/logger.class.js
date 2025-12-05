class Logger {
    static success(message) {
        console.log(`[SUCCESS] - ${message}`)
    }

    static info(message) {
        console.log(`[INFO] - ${message}`);
    }

    static warn(message) {
        console.log(`[WARN] - ${message}`);
    }

    static error(message) {
        console.log(`[ERROR] - ${message}`)
    }

    static display(message) {
        console.log(message)
    }
}

module.exports = Logger;
