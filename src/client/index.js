import docReady        from "doc-ready"
import client          from "socket.io-client"
import { renderClock } from "./clock.jsx"

const start = () => {
  const color = window.color
  const socket = client.connect("http://localhost:3000/")

  socket.on("connect", () => {
    console.log('connected')
    socket.emit("init", {
      color: color,
      basetime: Date.now()
    })
  })
  socket.on("disconnect", () => {
    console.log('disconnected')
  })

  socket.on("test", (data) => { console.log(data) })

  window.onclick = () => {
    console.log("clicked")
    socket.emit("click", {
      color: color,
      time: Date.now()
    })
  }

  renderClock(document.getElementById('clock'))
}

docReady(start)
