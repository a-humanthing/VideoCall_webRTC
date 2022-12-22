const express = require("express")
const app = express()
//this server can be used with socket.io
const { v4: uuidv4 } = require("uuid")
const server = require("http").Server(app)
const io = require("socket.io")(server)

app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`)
})
app.get("/:room", (req, res, next) => {
  res.render("room", { roomId: req.params.room })
})
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log(roomId, userId)
    socket.join(roomId)
    socket.to(roomId).emit("user-connected", userId)
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId)
    })
  })
})
server.listen(3000)
