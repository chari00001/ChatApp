const users = []

// addUser, removeUser, getUser, getUsersInRoom

// Checks if user doesn't exists, user and room names are provided, then adds user to users
const addUser = ({ id, username, room }) => {
    // Remove spaces and lowercase names
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if(!username || !room){
        return {
            error: 'Username and room are required.'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => user.room === room && user.username === username)

    // Validate username
    if(existingUser){
        return {
            error: 'Username is in use. Select another name.'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

// Removes the user by id
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

// Gets user by id
const getUser = (id) => {
    const foundUser = users.find((user) => user.id === id)
    return {
        username: foundUser.username,
        room: foundUser.room
    }
}

// Lists users in a specific room
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const foundUsers = users.filter((user) => user.room === room)
    return foundUsers
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}