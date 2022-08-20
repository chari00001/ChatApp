// Importing local packages
const path = require('path')
const http = require('http')

// Importing npm packages
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

// Creating app with express and using it in creating server via by http request
const app = express()
const server = http.createServer(app)

// Server has access to WebSockets via by io instance
const io = socketio(server)

// Storing port and public directory values in constants
const port = process.env.PORT || 8080
const publicDir = path.join(__dirname, '../public')

// Setting up static path for express
app.use(express.static(publicDir))

// Connection event listener
// socket is an object contains information about new connection
io.on('connection', (socket) => {
    console.log('New WebSocket connection!');

    // Sending Welcome message to new connection (client)
    socket.emit('message', "Welcome!")

    // Broadcast sends data to all connections except the one that sends the data
    socket.broadcast.emit('message', 'A new user has joined.')

    // Receiving event with message value from client and emitting it back to all connections
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)){
          return callback('Watch your profanity.')  
        }
        io.emit('message', message)
        // Acknowledgement callback
        callback()
    })

    // Receiving coordinates from client, transform it into google maps link, then send link back to all connections
    socket.on('sendLocation', (coords, callback) => {
        io.emit("locationMessage", `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        // Acknowledgement callback
        callback()
    })

    // On a user disconnection, send message to all other users
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})

// Starting server on port 
server.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})