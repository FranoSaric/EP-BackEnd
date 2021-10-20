const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

process.env.TZ = "Europe/Amsterdam";

var corsOptions = {
    origin: "http://192.168.2.20:8080/",
};

app.use(cors(corsOptions));
const db = require("./app/models");

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// force: true will drop the table if it already exists
//   db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   // initial()
// })

// simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome." });
//   initial();
// });

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/classrooms.routes")(app);
require("./app/routes/studies.routes")(app);
require("./app/routes/records.routes")(app);
require("./app/routes/terms.routes")(app);
require("./app/routes/roles.routes")(app);
require("./app/routes/courses.routes")(app);
require("./app/routes/categories.routes")(app);
require("./app/routes/books.routes")(app);
require("./app/routes/institutions.routes")(app);
require("./app/routes/statistics.routes")(app);
require("./app/routes/studentBook.routes")(app);
require("./app/routes/library.routes")(app);
require("./app/routes/booksLibrary.routes")(app);
require("./app/routes/roleClaim.routes")(app);
require("./app/routes/userClaim.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

