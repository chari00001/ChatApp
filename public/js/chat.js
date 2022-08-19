// Initializing connection
const socket = io()

// Receiving message event with message variable, then printing it to the console
socket.on('message', (message) => {
    console.log(message);
})

// Getting form by id and adding submit event listener
document.getElementById('form')
    .addEventListener('submit', (e) => {
        // Prevents page refreshing on form submission
        e.preventDefault()

        // Selecting message from input field
        const message = e.target.elements.message.value

        // Emitting event to server with message value
        socket.emit('sendMessage', message)
    })

// Location sharing field selected here and added click event handler 
document.getElementById('send-location')
    .addEventListener('click', (e) => {
        // Error handler for browsers doesn't support geolocation
        if(!navigator.geolocation){
            return alert('Geolocation is not supported by your browser.')
        }

        // If browser has support send destructured coordinates to server with sendLocation event
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords
            socket.emit('sendLocation', {
                latitude,
                longitude
            })
        }) 
    })