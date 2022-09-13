const port = 3000;

const dotenv = require("dotenv").config();
const mongoDB = process.env.DB_STRING;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------------------------------

// routes here

// 1. FILE SAVING UTILITIES
// this code enables the server to use multer to save an image that is attached as a payload to an http request to the servers 'uplaods' folder. Multer is a middleware we can attach to routes that we expect to receive file uploads. It will grab any attached files and make them available to the code. We will use multer to grab any incoming files on the POST endpoint, and it will immediately save them to a folder on the server called uploads. Then in the endpoint for the POST request, we can read the saved image as a buffer using the fs module, and send it to the server as binary data where it will be stored. We then finally delete the file from the upload folder and send back a response to the client to end the interaction.

// we must require multer after npm installing it. Multer will grab the formData file/image and save it to the uploads folder
const multer = require("multer");

// we'll need to load up the native fs library to then read the file from the uploads folder, converting it into a buffer so it can be saved to the database
const fs = require("fs");

// path library for getting the full directory of the uploads folder and properly setting the filename
const path = require("path");

// 2. SET UP MULTER
// prepare ability to store files on the server. This is all multer specific, as per the documentation
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
// now that the storage system is set up, we tell multer load it up so that we can use it as middleware for the routes that we want to enable file storage on
const upload = multer({
  storage: storage,
  limits: { fileSize: 5242880 },
});

// END OF MULTER SETUP

// 3. SCHEMA FOR GENERIC DOCUMENT
// this is a regular mongoose schema. Normally we would do this in a separate file but i want to keep this simple
const itemSchema = new mongoose.Schema({
  image: {
    // this schema is very simple, just a single field that holds the image data and a file type string. We could in theory add more fields if needed.
    data: Buffer,
    contentType: String,
  },
});
// no need to export the model since we are not in a different js file, so just save the model in a variable
const Item = new mongoose.model("Document", itemSchema);

// 4. ROUTES
// Here is the POST endpoint for uploading an image.
// note the extra argument passed into the post() method called uplaod. This is the multer middleware we prepared before. Middlewares that are attached to routes like this will run on the request before passing it on to the endpoint. Multer will grab any file field in the formData that is named 'attachment' and save its value to the uplaods folder, and then let the POST endpoint continue handling the request.
app.post("/images", upload.single("attachment"), async (req, res) => {
  if (!req.file) {
    // if no file, abort by sending an error message. If you don't want images to be required then change this logic to suit the application you are building
    res.json({ message: "no image received" });
  } else {
    // multer middleware saves file to upload folder and then:
    // create new data document using the model based on the schema
    const image = new Item({
      // we give the model an object that matches the pattern of the schema. This is what it will save
      image: {
        // the image is read from the upload folder where multer put it
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        // we also add this string to inform of what type of file it is
        contentType: "image/png",
      },
    });
    // then the image model is instructed to save its newly added data to the database
    image.save(() => {
      // once save is completed the image is deleted out of the upload folder
      fs.unlinkSync(path.join(__dirname + "/uploads/" + req.file.filename));
      res.json({ message: "hello" });
    });
  }
});
// basically, when a post request with a file or an image arrives on the back end to the POST endpoint, we use multer to grab it and unpack it out of the formData and put it in a folder, since the rest of the code cant handle formData fields. Once it is saved into a folder as a regular image, we can then use fs to read it, basically creating a binary representation of the image that can be fed to a mongoose model, which we then instruct to save it to the database. Once the binary is saved, we can delete the image from the uploads folder, since the image is safely on the database as binary data.

// 5. GET image
// getting the images is comparatively simple. Just gotta use the model to find all items for the database and send them back. IMPOORTANT: normally when we get data through mongoose it goes into an instance of the model, in this case Item. This model is a special object with a bunch of mongoose specific functionality as well as the data itself. We want to be able to send back the binary data as base64 so we need to use Item.find.lean() which returns the data not in a model instance but just a raw object. This also for some reason converts binary data to base64, no idea why tbh
app.get("/images", async (req, res) => {
  // get the matching data using find
  Item.find({}, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.send(results);
    }
  }).lean(); // lean() means just return a basic object, mot a mongoose model. This for some reason converts image data to base 64 which is what we want on the front end
});

// ------------------------------------------------------------------------------------
// configure a connection attempt to the database. The try/catch block will run the code in try, and if there is an error will execute the catch block, which receives the error as an argument that we handle using a parameter, in this case 'e' but it can be whatever you want. We are basically saying here, 'have a go at setting up a message to the database saying that you'd like to connect, and if it goes wrong console log the error'.
// Note that bit of code just sets up the connection attempt to the database.
try {
  // attempt to execute this code
  mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (e) {
  // if the prevoius code has an error, handle it here
  console.log("there was an error: " + e);
}

// Once the connection attempt is started, we can attach listeners to the object mongoose creates to represent the connection (mongoose.connection).

// if the connection experiences an error at any point such as a failure to contact the database or a problem with authenticaion, an error event is emitted. We can listen for it and console log it like this:
mongoose.connection.on("error", (e) => console.log(e));

// if the connection successfully reaches the database, it emits a connected event, which we can handle here:
mongoose.connection.on("connected", (e) => {
  // if a successful connection is established to the db
  console.log("connected to db"); // log a success message to the console
  app.listen(port, () => {
    // and start the web server that listens to http requests.
    console.log("listening on port " + port + "...");
  });
});
