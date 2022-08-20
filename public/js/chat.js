// Initializing connection
const socket = io()

// Selecting elements from DOM
const $messageForm = document.getElementById('form')
const $messageFormInput = document.getElementById('message')
const $messageFormButton = document.getElementById('send')
const $locationSendButton = document.getElementById('send-location')
const $messages = document.getElementById('messages')

// Selecting message and location templates
const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-template').innerHTML

// Receiving message event with message variable, then printing it to the console
socket.on('message', (message) => {
    console.log(message);
    // Rendering message template using Mustache, sending dynamic message value to it, then adding it to messages
    // createdAt has a value of H:mm formatted time
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('H:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

// Rendering location with mustache, adding setting href to url, then adding it back to messages 
socket.on('locationMessage', (url) => {
    console.log(url);
    const html = Mustache.render(locationTemplate, {
        url
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

// Adding submit event listener to form element
$messageForm.addEventListener('submit', (e) => {
    // Prevents page refreshing on form submission
    e.preventDefault()

    // Form button will be disabled for a short time to prevent accidental double clicks
    $messageFormButton.setAttribute('disabled', 'disabled')

    // Selecting message from input field
    const message = e.target.elements.message.value

    // Emitting event to server with message value
    socket.emit('sendMessage', message, (error) => {
        // Re-enabling button, emptying it and refocusing to input
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error);
        }
        // Acknowledgement message
        console.log('Message Delivered.');
    })
})

// Adding click event listener to location button
$locationSendButton.addEventListener('click', (e) => {
    // Error handler for browsers doesn't support geolocation
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }

    // Disabling button until it sends location successfully
    $locationSendButton.setAttribute('disabled', 'disabled')

    // If browser has support send destructured coordinates to server with sendLocation event
    navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords
        socket.emit('sendLocation', {
            latitude,
            longitude
        },
        () => {
            // Re-enabling button
            $locationSendButton.removeAttribute('disabled')
            console.log('Location shared.'); 
        })
    }) 
})