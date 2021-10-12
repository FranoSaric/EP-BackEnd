const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

process.env.TZ = 'Europe/Amsterdam'

var corsOptions = {
  origin: "http://192.168.2.20:8080/"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Uloga = db.uloga;

// force: true will drop the table if it already exists
//   db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial()
// })  

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome." });
  initial();
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/ucionica.routes')(app);
require('./app/routes/studiji.routes')(app);
require('./app/routes/evidencija.routes')(app);
require('./app/routes/termini.routes')(app);
require('./app/routes/kolegiji.routes')(app);
require('./app/routes/kategorija.routes')(app);
require('./app/routes/knjiga.routes')(app);
require('./app/routes/ustanova.routes')(app);
require('./app/routes/statistika.routes')(app);
require('./app/routes/studentKnjiga.routes')(app);
require('./app/routes/knjiznica.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Uloga.create({
    id: 1,
    naziv: "student"
  });
 
  Uloga.create({
    id: 2,
    naziv: "profesor"
  });
 
  Uloga.create({
    id: 3,
    naziv: "asistent"
  });

}