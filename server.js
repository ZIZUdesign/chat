const  fs = require('fs')
const EventEmitter = require('events')
const chatEmitter = new EventEmitter()
const express = require('express')
const port = process.env.PORT || 1337

const app = express()


app.get('/', respondText)
app.get('/json', respondJSON)
app.get('/echo', respondEcho)
app.get('/static/*', respondStatic)
// receives a message from the chat client 
app.get('/chat',respondChat )
// sendes a messages to the chat client 
app.get('/sse', respondSSE)

app.listen(port, () => console.log(`Servr listening on the port ${port}`))

function respondText (req, res ){
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hi')
}

function respondJSON (req, res ){
    res.setHeader('Content-Type', 'application/json')
    res.json({text: 'hi', numbers: [1,2,3]})
}

function respondChat (req, res){
    const { message } = req.query 

    chatEmitter.emit('message', message)
    //we send nothing since our char client will receive message from /sse 
    res.end()
}



function respondSSE(req, res){
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    })

    const onMessage = msg => res.write(`data: ${msg}\n\n`)
    chatEmitter.on('message', onMessage)

    res.on('close', function (){
        chatEmitter.off('message', onMessage)
    })
}

function respondEcho (req, res){
    const { input = ' ' } = req.query 

    res.json({
        normal: input,
        shoutly: input.toUpperCase(),
        characterCount: input.length,
        backwards: input
           .split('')
           .reverse()
           .join('')
    })
}

function respondStatic (req, res){
    const filename = `${__dirname}/public/${req.params[0]}`
    fs.createReadStream(filename)
        .on('error', ()=> respondNotFound(req, res))
        .pipe(res)
}

function respondNotFound(req, res){
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.end('Not Found')
}
