// Importing local packages
const path = require('path')
const http = require('http')

// Importing npm packages
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

// Importing utilities
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

// Creating app with express and using it in creating server via by http request
const app = express()
const server = http.createServer(app)

// Server has access to WebSockets via by io instance
const io = socketio(server)

// Storing port and public directory values in constants
const port = process.env.PORT || 8080
const publicDir = path.join(__dirname, '../public')

/**************** SERVER *****************/

// Setting up static path for express
app.use(express.static(publicDir))

// Connection event listener
// socket is an object contains information about new connection
io.on('connection', (socket) => {
    console.log('New WebSocket connection!');

    // Receive join event with required informations
    socket.on('join', ({ username, room }, callback) => {
        // Add user that joined with socket id
        const { error, user } = addUser({ id: socket.id, username, room })
        
        if(error){
            return callback(error)
        }

        // Connect to a specific room
        socket.join(user.room)

        // Sending Welcome message to new connection (client) as Bot
        socket.emit('message', generateMessage('Bot', 'Welcome!'))

        // Broadcast sends data to specific room except the one that sends the data
        socket.broadcast.to(user.room).emit('message', generateMessage('Bot', `${user.username} has joined!`))

        // Adds new connected user to user list
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    // Receiving event with message value from client and emitting it back to all members in room
    socket.on('sendMessage', (message, callback) => {
        const { username, room } = getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(message)){
          return callback('Watch your profanity.')  
        }
        io.to(room).emit('message', generateMessage(username, message))
        // Acknowledgement callback
        callback()
    })

    // Receiving coordinates from client, transform it into google maps link, then send link back to all members in room
    socket.on('sendLocation', (coords, callback) => {
        const { username, room } = getUser(socket.id)
        io.to(room).emit("locationMessage", generateLocationMessage(username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        // Acknowledgement callback
        callback()
    })

    // On a user disconnection, send message to all other users
    socket.on('disconnect', () => {
        // On disconnection, remove user and if there is a removed user send a message to all members in room
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Bot', `${user.username} has left.`))
            // On disconnection refreshes user list after removing a user disconnected
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

// Starting server on port 
server.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})