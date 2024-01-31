const express = require("express");
const fs = require("fs");
const status=require("express-status-monitor");
const app = express();
app.use(status());
// have aapde ek package install karyu che express-status-monitor have eno use karine apde memory usage ,cpu utilization ne evu badhu jani sakie chie 
// ena mate localhost:8000/status em karvanu 
//have aama thay kevu ke aapde first file ne read karie chie assume ke file size 400mb che to e aakho file no data first data variable ma aavse pachi aapde tene res.end karavie chie means server ni memory ma aapde thodak time mate 400 mb data store karavie chie to aavu na karvu hoy to aapde streaming no use karsu karan ke aa efficient way nathi aa rite memory ne bagadi ne karvano
//streaming ma kevu hoy ke aapde chunk ma data laie backend ma thi jevo chunk ma data aavyo ke tarat jaapde tene frontend ma show karai daie means aapde memory ma kai store nai karavta 
app.get("/", (req, res) => {
//   fs.readFile("./sample.txt", (err, data) => {
//     res.end(data);
//   });

//streaming way
const stream=fs.createReadStream("./sample.txt","utf-8");
stream.on("data",(chunk)=>res.write(chunk));
stream.on("end",()=>res.end());
});

app.listen(8000, (err) => {
  if (!err) {
    console.log("Server is listening from port number 8000");
  }
});
