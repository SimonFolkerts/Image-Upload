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

// ------------------------------------------------------------------------------------

// routes here

// multer
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// prepare ability to store files on the server
const storage = multer.diskStorage({
  // define the folder into which uploaded image goes
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  // define the filename to use
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// instantiate the storage object
const upload = multer({
  storage: storage,
  limits: { fileSize: 5242880 },
});

// new schema
const documentSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String,
  },
});
// model
const Document = new mongoose.model("Document", documentSchema);

// route
app.post("/images", upload.single("attachment"), async (req, res) => {
  // multer middleware saves file to upload folder
  // create new document
  const image = new Document({
    // t has an image field that contains two properties, the image binary data and a content type
    image: {
      // the image is read from the upload folder as binary
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  });
  // then the image is saved
  image.save(() => {
    // once save is completed the image is deleted out of the upload folder
    fs.unlinkSync(path.join(__dirname + "/uploads/" + req.file.filename));
    res.json({ message: "hello" });
  });
});

app.get("/images", async (req, res) => {
  // get the matching data
  Document.find({}, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.send(results);
    }
  }).lean(); // lean() means just return a basic object, mot a mongoose model. This efor some reason converts image data to base 64 which is what we want on the front end
});

// ------------------------------------------------------------------------------------

try {
  mongoose.connect(
    mongoDB,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      app.listen(port, () => {
        console.log("listening on port " + port + "...");
      });
    }
  );
} catch (e) {
  console.log("there was an error" + e);
}

const db = mongoose.connection;
db.on("error", (e) => console.log(e));
db.on("connected", (e) => console.log("connected to db"));
