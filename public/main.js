
var socket = io()
const peer = new Peer() 
peer.on('open' , id => {
    socket.emit('peer' , id)
})
const idElement = document.querySelector("#idElement")
const myVideo =  document.querySelector("#myVideo")
const friendIdForm =  document.querySelector("#friendIdForm")
const inputElement =  document.querySelector("#inputElement")
const frendVideo =  document.querySelector("#frendVideo")




;(async () => {
    let data  = await   window.navigator.mediaDevices.getUserMedia({
        video: true , audio: true , peerIdentity: true
    })
    myVideo.srcObject = data
}) ()
socket.on('front' , id =>{
console.log(id);
idElement.textContent = id
})
friendIdForm.addEventListener('submit' , event => {
    event.preventDefault()
    socket.emit('call' ,inputElement.value.trim())
})
socket.on('error' , e =>  alert(e))
socket.on('call' ,e => {
    var conn = peer.connect(e)
    conn.on('open',async  () => {  
        let data = await window.navigator.mediaDevices.getUserMedia({
            video: true , audio: true , peerIdentity: true
        })
        let call  = peer.call(e , data)
        call.on('stream' ,  remoteStream => {
            frendVideo.srcObject = remoteStream
        })
    })
})
peer.on('call', async call => {
    let data = await window.navigator.mediaDevices.getUserMedia({
        video: true , audio: true , peerIdentity: true
    })
    call.answer(data)
    call.on('stream' , function(remoteStream){
        frendVideo.srcObject = remoteStream

    })
})