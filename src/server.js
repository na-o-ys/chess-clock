import http     from "http"
import socketIO from "socket.io"
import fs       from "fs"
import express  from "express"

const app    = express(),
      server = http.Server(app).listen(3000),
      io     = socketIO(server)

app
  .get('/js/client.js', (req, res) => {
    res.sendFile('build/js/client.js', { root: __dirname + '/../'})
  })
  .get('/:gid/a', (req, res) => {
    res.send('hello')
  })
  .get('/', (req, res) => {
    res.sendFile('build/index.html', { root: __dirname + '/../' })
  })

// TODO: express
// const server = http.createServer((req, res) => {
//   if (req.url == '/js/client.js') {
//     res.writeHead(200, { 'Content-Type': 'application/javascript' })
//     res.end(fs.readFileSync('build/js/client.js'))
//   } else if (req.url == '/a') {
//     res.writeHead(200, { 'Content-Type': 'text/html' })
//     res.end(fs.readFileSync('build/a.html', 'utf-8'))
//   } else {
//     res.writeHead(200, { 'Content-Type': 'text/html' })
//     res.end(fs.readFileSync('build/index.html', 'utf-8'))
//   }
// }).listen(3000)
// const io = socketIO.listen(server)

class Clock {
  constructor(client_b, client_w) {
    this.clients = [client_b, client_w]
  }

  start() {
    this.clients[0].start
    this.turn = 0
  }

  click(color) {
    if (this.turn != color) {
      return
    }

    this.clients[color].stop
    this.clients[color^1].start
    this.turn ^= 1
  }

  exceeded(color) {
    if (this.turn != color) {
      return
    }

    this.clients[color].lose
    this.clients[color^1].win
  }
}

class ClockClient {
  constructor(uid, color, sockets) {
    this.uid = uid
    this.color = color
  }

  start() {
    sockets.find(this.uid).emit("start")
  }

  stop() {
    sockets.find(this.uid).emit("stop")
  }

  win() {
    sockets.find(this.uid).emit("win")
  }

  lose() {
    sockets.find(this.uid).emit("lose")
  }
}

var sockets = {
  list: {},

  find(uid) {
    this.list[uid]
  },

  add(uid, sock) {
    this.list[uid] = sock
  }
}

var clocks = {
  list: {},

  find(gid) {
    this.list[gid]
  },

  add(gid, clock) {
    this.list[gid] = clock
  }
}

io.on('connection', (sock) => {
  sock.on("init", (data) => {
    sockets.add(data.uid, sock)
    new ClockClient(data.uid, data.color, sockets)
  })
  sock.on("click", (data) => {
    io.sockets.emit("test", data)
  })
})
