var express = require("express");
var app = express();

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

var HTTP_PORT = process.env.PORT || 8080;

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.send("API listening ");
});

app.post("/api/movies", (req, res)=>{
  db.addNewMovie(req.body).then((data)=>{
      res.status(201).json(data);
  }).catch((err)=>{
     res.json({ message: err });
  });
});


app.get("/api/movies", (req, res)=>{
  db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data)=>{
      res.json(data);
  }).catch((err)=>{
      res.status(404).json({ message: err });
  });
});

app.get("/api/movies/:id", (req, res)=>{
  const id = req.params.id;
  db.getMovieById(id).then((data)=>{
      res.json(data);
  })
  .catch((err)=>{
      const msg = `Cannot find Movie id: ${id} in the database. ERROR: ${err}`;
      console.log(msg);
      res.status(204).json(msg);
  });
});

app.put("/api/movies/:id", (req, res)=>{
 const id = req.params.id;
  db.updateMovieById(req.body, id).then(()=>{
     res.send(`${req.body.title} updated.`);
  }).catch((err)=>{
     res.status(500).send(`Cannot update Movie. ERROR: ${err}`);
  });
});

app.delete("/api/movies/:id", (req, res)=>{
  const id = req.params.id;
  db.deleteMovieById(id).then(()=>{
     res.send(`Movie id: ${id} deleted`);
  }).catch((err)=>{
     res.status(204).send(`Cannot find Movie id: ${id} in the database. ERROR: ${err}`);
  });
});


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err)=>{
  console.log(err);
});

