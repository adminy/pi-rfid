'use strict'
// const fs = require('fs')
const loadSocketServer = require('./server')
const readCard = require('./read_card')

const ssl = !{
    http2: true,
    https: {
      allowHTTP1: true, // fallback support for HTTP1
      //key: fs.readFileSync(`${__dirname}/ssl/server.key`),
      //cert: fs.readFileSync(`${__dirname}/ssl/server.cert`)
    }
}

loadSocketServer(ssl).then(server => {
    server.static(process.cwd() + '/web')

    
    // API here
    // server.get('/checkRoom/:roomID', (req, res) => res.send(updateRoom(req.params.roomID)))
    // server.get('/:roomID/:name', (req, res) => res.send(process.cwd() + '/dist/index.html'))

    const workToDo = {
        // hasWork, data, callback
    }


    const clients = server.websocketServer.clients

    readCard(info => clients.forEach(client => client.send(JSON.stringify(info))), workToDo)
    


    // // Live API here
    server.get('/socket', { websocket: true }, (connection, req, params) => {
        const ws = connection.socket
       
        ws.on('message', msg => {
            workToDo.data = msg
            workToDo.callback = () => ws.send(JSON.stringify({written: true}))
            workToDo.hasWork = true
        }) //server.websocketServer.clients.forEach(client => client != ws && client.send(msg)))
        ws.on('close', () => {})
        // ws.send('[]')
    })

    server.listen(ssl ? 443 : 80, '0.0.0.0').then(addr => console.log(`server listening on ${addr}`))
})