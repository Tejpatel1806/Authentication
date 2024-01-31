const express=require("express");
const http=require("http");
const path=require("path");
const app=express();
const {Server} =require("socket.io");
const server=http.createServer(app);
app.use(express.static(path.resolve("./public")));



//matlab io che te aapdi socket ne handle karse 
const io=new Server(server);
io.on("connection",(socket)=>{
    // console.log("new user connected",socket.id);

    //have server side aapde evu karie chie ke jyare frontendside client kai user-message jevu event fire kare tyare aa baju vadu callback function execute thase ane ema aapde message print karavie chie pan aapde evu karvu che ke e message che te badha users ne jato rehvo joie to ena mate niche mujab karvanu 
    socket.on("user-message",(message)=>{
        console.log('A new user message',message);
        io.emit("message",message);
    })
})



app.get("/",(req,res)=>{
    res.sendFile("/public/index.html");
})
server.listen(9000,(err)=>{
    if(!err)
    {
        console.log("Server is listening on port number 9000");
    }
})