// Initializing connection
const socket = io()

// Receiving message event with message variable, then printing it to the console
socket.on('message', (message) => {
    console.log(message);
})

// Getting form by id and adding submit event listener
const form = document.getElementById('form')
    .addEventListener('submit', (e) => {
        // Prevents page refreshing on form submission
        e.preventDefault()

        // Selecting message from input field
        const message = e.target.elements.message.value

        // Emitting event to server with message value
        socket.emit('sendMessage', message)
    })