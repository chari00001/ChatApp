// Reformatting messages as an object of text and timestamp
const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

// Exporting function
module.exports = {
    generateMessage
}