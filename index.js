const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const express = require("express");
const tareasRouter = require("./routes/tareas");

const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = process.env.PORT || 3000;

const app = express();
mongoose.connect('mongodb://localhost:27017/tareas-backend', {useNewUrlParser: true});

app.use(bodyParser.json());

// Redirige las peticiones con URL que terminan en / al equivalente sin la barra final.
// Ej: http://localhost/tasks/ se redirige a https://localhost/tasks
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  const test = /\?[^]*\//.test(req.url);
  if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
    res.redirect(301, req.url.slice(0, -1));
  else
    next();
});

app.use("/tasks",tareasRouter);
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Accept", "application/json");
  try{
    next()
  }catch(error){
    res.status = 500;    
    res.send({mensaje:'Explotó '+error.message});
  }
})
app.use("/",(req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  res.statusCode = 200;
  res.setHeader("Content-type", "text/html");
  res.end(
    "<body><title>Tareas REST API</title><h1>API RESTful de Tareas</h1></body>"
  );
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Servidor escuchando en el host ${hostname} y puerto ${port}`);
});
