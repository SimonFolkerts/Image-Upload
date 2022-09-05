const port = 3000;
const mongoDB =
  "mongodb+srv://simonfolkerts:watermelon@testdb.flgps.gcp.mongodb.net/Crud_Demo?retryWrites=true&w=majority";

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const User = require("./User");

app.use((req, res, next) => {
  console.log(req.method + " to " + req.url);
  next();
});

app.get("/data", function (req, res) {
  res.send({ data: "get" });
});

app.post("/data", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

app.put("/data", (req, res) => {
  res.send({ data: "put" });
});

app.delete("/data", (req, res) => {
  res.send({ data: "delete" });
});

mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    app.listen(port, () => {
      console.log("listening on port " + port + "...");
    });
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
