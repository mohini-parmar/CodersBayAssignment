const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const todoRoutes = require("./routes/todoRoutes")
const userRoutes = require("./routes/userRoutes")
const port = 8000

dotenv.config();

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/todoapp")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.use(cors());
app.use(bodyParser.json());

app.use("/api/todos", todoRoutes);
app.use("/api/user",userRoutes)

app.listen(port, () => {
    console.log(`Listening to http://localhost:${port}`);
  });