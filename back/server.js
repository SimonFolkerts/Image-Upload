const port = 3000;

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.method + " to " + req.url);
});

app.get("/data", function (req, res) {
  res.send({ data: "get" });
});

app.post("/data", (req, res) => {
  res.send({ data: "post" });
});

app.put("/data", (req, res) => {
  res.send({ data: "put" });
});

app.delete("/data", (req, res) => {
  res.send({ data: "delete" });
});

app.listen(port, () => {
  console.log("listening on port " + port + "...");
});
