import express from "express";
import {Server} from "socket.io";
import http from "http"
import path from "path";




const app = express();
const server = http.createServer(app)
const io = new Server(server);
io.on('connection', socket=>{
    console.log(`user connected: ${socket.id}`);
    user.set(socket.id, socket.id);

    socket.emit('user:joined', socket.id);

    socket.io('outgoing:call', data=>{
        const {fromOffer, to} = data;
        socket.to(to).emit('incoming:call',{from: socket.id, offer:fromOffer});
    })
    
    socket.io('call:accepted', data=>{
        const {answer, to} = data;
        socket.to(to).emit('outgoing:call',{from:socket.id,offer:answer})
    })



    socket.on('disconnect',()=>{
        console.log(`user disconnected: ${socket.id}`);
    })
})




app.use(express.static(path.resolve("./public")));

const map = new Map();


app.get("/get-users",(req,res)=>{
    return res.json(Array.from(map))
})

const PORT=3445;
app.listen(PORT,()=>{
    console.log(`Server is listening on the port ${PORT}`);
})