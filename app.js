const express = require("express")
const app = express();
const path = require("path");
const { MongoClient, ServerApiVersion } = require('mongodb');
const { random_name } = require("./source/random_name.js");
const fs = require('fs');
const fileUpload = require('express-fileupload');
const AdmZip = require('adm-zip');



// setting mongodb 
// chA1ueDN

// const uri = "mongodb://localhost:27017";

// const client = new MongoClient(uri);


const uri =
  "mongodb+srv://Geek:Wu2wm5ltnipo3FcP@chatbot.rm39fbb.mongodb.net/?retryWrites=true&w=majority&appName=chatbot";

// Create a new MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


// client.connect().then((val) => {
//   console.log("connected to 127.0.0.1:27017");
// }).catch((err) => {
//   console.log("Momgodb error! fail to connected", err);
//   exit();
// })

// Connect to the MongoDB server
db = client.db("comic_data"); // Assign the database instance
let comic_name_collection = db.collection("comic_name_collection");
let comic_folder_collection = db.collection("comic_folder_collection");

// mongodb code ends here

// app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'data')));
app.use(fileUpload());
app.use(express.json());



app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
})


app.get("/yawainaing778/upload", (req, res) => {
  res.sendFile(`${__dirname}/upload.html`)
})
//✅

// app.post("/new_comic", async (req, res) => {
//   try {

//     let textData = req.body;

//     let comic_name = textData.name;
//     let author = textData.author;
//     let artist = textData.artist;
//     let genres = textData.gener;
//     let release_year = textData.release;

//     let status = "OnGoing"

//     if (!comic_name || !author || !artist || !genres || !release_year) {
//       throw new Error("Fill all inputs and try again!");
//     }

//     // Check if comic name already exists
//     let check_comic_name = await comic_name_collection.find({ comic_name }).toArray();
//     if (check_comic_name.length > 0) {
//       throw new Error("That comic already exists!");
//     }

//     // Check if file is provided
//     if (!req.files || !req.files.thumbnail) {
//       return res.json({ status: 400, msg: "No image found!" });
//     }

//     let file = req.files.thumbnail;

//     // Check if the uploaded file is an image
//     if (!file.mimetype.startsWith("image/")) {
//       throw new Error("Only images are accepted!");
//     }

//     // Generate unique filename
//     let filename = random_name.get_name(8) + "_" + Date.now() + '_' + Math.round(Math.random() * 1E9) + ".jpg";

//     // Upload the thumbnail image
//     await new Promise((resolve, reject) => {
//       file.mv(`./data/${filename}`, (err) => {
//         if (err) {
//           reject(err);
//         } else {
//           console.log("Thumbnail uploaded!");
//           resolve();
//         }
//       });
//     });

//     // Generate a unique comic ID
//     let comic_id = await random_name.unique_name(comic_name_collection);
//     let total_pdf = 0;
//     let view = 0;
//     let thumbnail = filename;
//     let folder_names = [];

//     // Prepare comic data for insertion
//     let data = { comic_name, comic_id, description, type, total_pdf, view, folder_names, thumbnail };

//     // Insert the new comic into the database
//     let addToDataBaseStatus = await comic_name_collection.insertOne(data);

//     if (addToDataBaseStatus.acknowledged === true) {
//       return res.json({ status: 200, msg: "Comic added successfully!", comic_id });
//     } else {
//       throw new Error("Failed to add to the database. Please contact the developer.");
//     }

//   } catch (err) {
//     // console.error(err);
//     return res.status(400).json({ status: 400, msg: err.message });
//   }
// });
//✅


app.post("/new_comic", async (req, res) => {
  let filename;
  try {
    let textData = req.body;

    let comic_name = textData.name;
    let author = textData.author;
    let artist = textData.artist;
    let genres = textData.gener;
    let release_year = textData.release;

    // checking input field to make sure they are not empty;
    // if string is empty ig: str = "" that is equal false
    // so we will do !comic_name --> if comic name is false (!) will convert it into true and that if will run
    // same way we will add (||) to make sure if even one filed it empty that if will excute

    if (!comic_name || !author || !artist || !genres || !release_year) {
      throw new Error("Please fill all fields");
    }

    if (!req.files || !req.files.thumbnail) {
      throw new Error("Please upload a thumbnail");
    }

    // searching comic_name is data base if length is greater than 0 than that comic is already exist!
    let comic_name_exist_status = await comic_name_collection.find({ comic_name }).toArray();
    if (comic_name_exist_status.length > 0) {
      throw new Error("That comic already exist!");
    }

    filename = random_name.get_name(8);
    filename = filename + "_" + Date.now();

    let thumbnail = req.files.thumbnail;
    if (!thumbnail.mimetype.startsWith("image/")) {
      throw new Error("Please upload an image");
    }

    await new Promise((resolve, reject) => {
      thumbnail.mv(`./data/${filename}`, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("Thumbnail uploaded!");
          resolve();
        }
      });
    });

    let thumbnail_id = filename;

    // adding all data to database
    /*
    1. we need a comic_id
    2.data will look like that {comic_name,author,artist,release_date,genes,view,total_episode}

    */

    // getting unique comic_id
    let comic_id = await random_name.unique_folder_id(comic_name_collection);
    let data = {
      comic_name,
      comic_id,
      thumbnail_id,
      author,
      artist,
      genres,
      release_year,
      views:0,
      total_episode:0,
      episode_id:[]
    }

    let dataBaseStatus = await comic_name_collection.insertOne(data);
    if(!dataBaseStatus.insertedId){
      throw new Error("file upload error")
    }

    res.json({status:200,comic_id});
  }
  catch (err) {
    if(filename!=undefined){
      try{
        if(fs.existsSync(`./data/${filename}`)){
          fs.unlinkSync(`./data/${filename}`);
          return res.json({status:400,msg:err.message});
        }
      }
      catch(err){
        return res.json({status:400,msg:"Error file uploading file!"});
      }
    }
    return res.json({ status: 400, msg: err.message });
  }
})

app.post("/admin/comic_details",async(req,res)=>{
  try{
    let comic_id = req.body.comic_id;
    let access  = req.body.access;
    
    comic_id = comic_id.trim()

    let comic_details = await comic_name_collection.find({comic_id}).toArray();
    console.log(comic_details);
    if(comic_details.length<1){
      throw new Error("Comic not found!");
    }

    if(access=="existance"){
      res.json({status:200,comic_id:comic_id});
    }

  }
  catch(err){
    res.json({status:400,msg:err.message});
  }
})

app.post("/admin/upload_zip",async(req,res)=>{
  let unique_folder_id;
  let filename;
  try{
    let comic_id = req.body.comic_id;
    comic_id = comic_id.trim();

    // checking comic_id

    let check_comic_id  = await comic_name_collection.find({comic_id}).toArray();
    if(check_comic_id.length<1){
      return res.json({status:400,msg:"Comic not found!"});
    }

    // getting unquire folder_name;

    filename = await random_name.get_name(8)+".rar"
    unique_folder_id = await random_name.unique_folder_id(comic_folder_collection);


    let zip = req.files.zip;
    if(zip.mimetype!=="application/x-zip-compressed"){
      return res.json({status:400,msg:"Invalid file type.File must be a zip!"});
    }

    await new Promise((resolve, reject) => {
      zip.mv(`./data/${filename}`, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("zip uploaded!");
          resolve();
        }
      });
    });

    const unzip = new AdmZip(`./data/${filename}`);
    unzip.extractAllTo(`./data/${unique_folder_id}`, true);

    // after unzipping delete the zip file
    fs.unlinkSync(`./data/${filename}`);

    // now database times come
    // 1.update comic_nmae_collection
    // 2. upldate folder_name_collection

    let dbSts = await comic_name_collection.updateOne(
      { comic_id },
      { $push: { episode_id:unique_folder_id } }
    );

    let statusUpate = await comic_name_collection.updateOne(
      { comic_id },
      { $set: { status: req.body.status } }
    );

    // searching comic_folder_collection
    
    let isExistCollection = await comic_folder_collection.find({comic_id}).toArray();
    if(isExistCollection.length>0){
      let updateFolderName = await comic_folder_collection.updateOne({comic_id},{$set:{[unique_folder_id]:unique_folder_id}});
    }
    else{
      let insertFolderName = await comic_folder_collection.insertOne({comic_id, [unique_folder_id]:unique_folder_id})
    }
    res.json({st:"done"});
  
  }
  catch(err){
    console.log(err);
    try{


    }
    catch(err){
      console.log(err);
      return res.json({status:400,msg:"Error in file upload!"});
    }
    res.json({status:400,msg:err.message});
  }  
})

app.get("/admin/random_comic",async(req,res)=>{
  try{
    const random_comic = await comic_name_collection.aggregate([{ $sample: { size: 8 } }]).toArray();
    res.json({status:200,random_comic});
  }
  catch(err){
    res.json({status:400,msg:err.message});
  }
})

app.listen(8000, () => {
  console.log("server is running...")
})