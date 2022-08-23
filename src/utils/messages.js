// Reformatting messages and locations as an object of text and timestamp
const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

// Exporting function
module.exports = {
    generateMessage,
    generateLocationMessage
}