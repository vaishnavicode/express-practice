// server.js
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

// Import the routes module
const routes = require("./routes/router");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set view engine as EJS
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/", routes);
app.use((req, res, next) => {
  res.render("error", {
    heading: "404",
    content: "Cannot find the page specified!",
    redirect: { desc: "Go To Home", link: "/" },
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
