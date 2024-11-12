const express = require("express")
const app = express();
const path = require("path");
const { MongoClient } = require('mongodb');
const { random_name } = require("./source/random_name.js");
const fs = require('fs');
const fileUpload = require('express-fileupload');
const AdmZip = require('adm-zip');
// const { pdf2img } = require("./source/pdf_to_img.js");



// setting mongodb 
// chA1ueDN

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);


// const uri =
//   "mongodb+srv://Geek:Wu2wm5ltnipo3FcP@chatbot.rm39fbb.mongodb.net/?retryWrites=true&w=majority&appName=chatbot";

// // Create a new MongoClient
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });


client.connect().then((val) => {
  console.log("connected to 127.0.0.1:27017");
}).catch((err) => {
  console.log("Momgodb error! fail to connected", err);
  exit();
})

// Connect to the MongoDB server
db = client.db("comic_data"); // Assign the database instance
let comic_name_collection = db.collection("comic_name_collection");
let comic_pdf_collection = db.collection("comic_pdf_collection");

// mongodb code ends here

// app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'data')));
app.use(fileUpload());
app.use(express.json());





app.get("/yawainaing778/upload", (req, res) => {
  res.sendFile(`${__dirname}/upload.html`)
})
//✅

app.post("/new_comic", async (req, res) => {
  try {
    // Validate required fields
    let textData = req.body;
    let comic_name = textData.name;
    let description = textData.description;
    let type = textData.type;
    let status = "ongoing"

    if (!comic_name || !description || !type) {
      throw new Error("Fill all inputs and try again!");
    }

    // Check if comic name already exists
    let check_comic_name = await comic_name_collection.find({ comic_name }).toArray();
    if (check_comic_name.length > 0) {
      throw new Error("That comic already exists!");
    }

    // Check if file is provided
    if (!req.files || !req.files.thubmnail) {
      return res.json({ status: 400, msg: "No image found!" });
    }

    let file = req.files.thubmnail;

    // Check if the uploaded file is an image
    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Only images are accepted!");
    }

    // Generate unique filename
    let filename = random_name.get_name(8) + "_" + Date.now() + '_' + Math.round(Math.random() * 1E9) + ".jpg";

    // Upload the thumbnail image
    await new Promise((resolve, reject) => {
      file.mv(`./data/${filename}`, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("Thumbnail uploaded!");
          resolve();
        }
      });
    });

    // Generate a unique comic ID
    let comic_id = await random_name.unique_name(comic_name_collection);
    let total_pdf = 0;
    let view = 0;
    let thubmnail = filename;
    let folder_names = [];

    // Prepare comic data for insertion
    let data = { comic_name, comic_id, description, type, total_pdf, view, folder_names, thubmnail };

    // Insert the new comic into the database
    let addToDataBaseStatus = await comic_name_collection.insertOne(data);

    if (addToDataBaseStatus.acknowledged === true) {
      return res.json({ status: 200, msg: "Comic added successfully!", comic_id });
    } else {
      throw new Error("Failed to add to the database. Please contact the developer.");
    }

  } catch (err) {
    // console.error(err);
    return res.status(400).json({ status: 400, msg: err.message });
  }
});
//✅



app.post("/check_comic_id", async (req, res) => {
  try {
    console.log("code is here")
    let comic_id = req.body.comic_id;

    let check = await comic_name_collection.find({ comic_id: comic_id }).toArray();
    if (check.length < 1) {
      throw new Error("comic id not found!");
    }
    else {
      res.json({ status: 200, comic_id: comic_id, total_pdf: check[0].total_pdf, comic_name: check[0].comic_name })
    }
  }
  catch (err) {
    res.json({ status: 400, msg: err.message });
  }
})
// ✅


app.post("/upload_pdf", async (req, res) => {
  let filename;
  let unquie_folder_name;
  try {
    filename = random_name.get_name(8) + "_" + Date.now() + '_' + Math.round(Math.random() * 1E9) + ".rar";

    if (!req.files || !req.files.pdf) {
      throw new Error("File not found!");
    }

    if (!req.body.status) {
      throw new Error("select the status");
    }

    let check_comic_id = await comic_name_collection.find({ comic_id: req.body.comic_id }).toArray();
    if (check_comic_id[0] == undefined) {
      throw new Error("Comic ID is invalid");
    }

    let file = req.files.pdf;

    console.log(file.mimetype);


    if (file.mimetype !== "application/x-zip-compressed") {
      throw new Error("File type must be .zip");
    }

    unquie_folder_name = await random_name.unique_pdf_id(comic_pdf_collection);

    // Wrap the file.mv() in a Promise so you can await it
    await new Promise((resolve, reject) => {
      file.mv(`./data/${filename}`, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    

    // code flow
    // at this point we have a zip file and its name is stored in filename
    // so we need to unzip and store it inside folder and its name is stored unque_folder_name
    
    const zip = new AdmZip(`./data/${filename}`);
    zip.extractAllTo(`./data/${unquie_folder_name}`, true);

    // after unzipping delete the zip file
    fs.unlinkSync(`./data/${filename}`);


    // now we have to count total files in that folder and add it inside comic_name_collection folder_name array

    let comic_id = req.body.comic_id;

    // Push pdf_id to comic_name_collection's pdf_id array
    let dbSts = await comic_name_collection.updateOne({ comic_id }, { $push: { folder_names: unquie_folder_name } });
    let statusUpate = await comic_name_collection.updateOne({ comic_id }, { $set: { status: req.body.status } });

    if (dbSts.modifiedCount !== 1) {
      throw new Error("Failed to update comic, contact the developer!");
    }

  

    

    // Find or create document in comic_pdf_collection
    let search_comic_id = await comic_pdf_collection.find({ comic_id }).toArray();
    let dbStatus;

    let total_images_in_folder = fs.readdirSync(`./data/${unquie_folder_name}`);
    let total_images = total_images_in_folder.length;

    if (!search_comic_id.length) {
      // No document found, insert new document
      dbStatus = await comic_pdf_collection.insertOne({ comic_id, [unquie_folder_name]: total_images });
    } else {
      // Update existing document
      dbStatus = await comic_pdf_collection.updateOne({ comic_id }, { $set: { [unquie_folder_name]: total_images } });
    }

    if (dbStatus.acknowledged) {
      return res.status(200).json({ msg: "Done!", comic_id: comic_id, pdf_id: unquie_folder_name });
    } 
    else {
      throw new Error("An unknown error occurred! 😅😅");
    }
  }
  catch (err) {
    console.log(err);
    try {
      if(fs.existsSync(`./data/${filename}`)){
        fs.unlinkSync(`./data/${filename}`);
      }
      fs.rmSync(`./data/${unquie_folder_name}`, { recursive: true, force: true });
    }
    catch (err) { console.log(err) }
    return res.status(500).json({ msg: err.message });
  }
});



app.get("/admin/random_back", (req, res) => {
  let a = fs.readdirSync("./public/back_img");
  let random = Math.random() * a.length;

  random = Math.floor(random);
  console.log(random);
  let res_url = a[random];
  if (res_url == "loading.gif") {
    res_url = "back5.jpg"
  }
  console.log(res_url);
  res.send(res_url);
})


app.get("/", (req, res) => {
  try {
    res.sendFile(`${__dirname}/index.html`);
  }
  catch (err) {
    res.send("<h1> 500 internal server error </h1>")
  }
})

app.get("/get_random_comic", async (req, res) => {
  try {
    const data = await comic_name_collection.aggregate([{ $sample: { size: 8 } }]).toArray();
    res.send(data);
  }
  catch (err) {
    res.send({ status: 400, msg: "Fail to get comic!" });
  }

})
app.post("/get_details", async (req, res) => {
  try {
    let comic_id = req.body.comic_id;
    let data = await comic_name_collection.find({ comic_id }).toArray();
    if (data[0] == undefined) {
      res.json({ staus: 400, msg: "Error! Comic not found!" })
    }
    else {
      let html = `
      <h3>${data[0].comic_name}</h3>
            <p class="type">${data[0].type}</p>
            <p class="des">${data[0].description}</p>
            <a href="comic/${data[0].comic_id}" class="read_now_2">Read</a>
      `
      res.json({ status: 200, html: html })
    }
  }
  catch (err) {
    res.json({ status: 200, msg: err.message });
  }
})

app.post("/get_comic", async (req, res) => {
  try {
    console.log(req.body)
    let comic_id = req.body.comic_id;
    let data = await comic_name_collection.find({ comic_id }).toArray();


    if (data.length < 1) {
      throw new Error("Comic not found!")
    }

    console.log(data[0].thubmnail)
    let name = data[0].comic_name;
    let type = data[0].type;
    let description = data[0].description;
    let thubmnail = data[0].thubmnail;
    let folder_names = data[0].folder_names;

    let response_data = { name, type, description, thubmnail, folder_names };

    console.log(response_data);

    res.json({ status: 200, data: response_data });

  }
  catch (err) {
    console.log(err)
    res.json({ status: 400, msg: err.message });
  }
})


app.get("/comic/*", (req, res) => {
  // console.log(req.path)
  try {
    res.sendFile(`${__dirname}/comic.html`)
  }
  catch (err) {
    res.send(err.message);
  }
})

app.get("/read/*", async (req, res) => {
  try {
    

    res.sendFile(`${__dirname}/read.html`);
  }
  catch (err) {
    console.log(err);
    res.send(err.message);
  }
})

app.post("/get_img_num", async (req, res) => {
  try {
    // let pdf_folder = req.body.folder_name;
    
    // let folder = await comic_pdf_collection.find({ [pdf_folder]: { $exists: true } }).toArray();
    // if (folder.length < 1) {
    //   throw new Error("404 comic not found!");
    // }
    // let img = fs.readdirSync(`./data/${pdf_folder}`);
    // res.json({ status: 200, img });

    let folder_name = req.body.folder_name;
    console.log(folder_name)
    let folder = await comic_pdf_collection.find({ [folder_name]: { $exists: true } }).toArray();
    let comic_id;
    if(folder.length<1){
      throw new Error("<h1> 404 comic not found! </h1>");
    }
    
    comic_id = folder[0].comic_id;
    let folder_id_array = await comic_name_collection.find({comic_id}).toArray();
    if(folder_id_array.length<1){
      throw new Error("<h1> 400 Fail to get folders");
    }
    folder_id_array = folder_id_array[0].folder_names;

    let current_index = folder_id_array.indexOf(folder_name);
    let previous;
    let next;
    if(current_index==0){
      previous = null
    }
    else{
      previous = folder_id_array[current_index-1];
    }

    if(current_index+1==folder_id_array.length){
      next = null
    }
    else{
      next = folder_id_array[current_index+1];
    }
    let images = fs.readdirSync(`./data/${folder_name}`);
    if(images.length<1){
      throw new Error("No images in folder");
    }
    res.json({status:200,images,next,previous});


    
     
  }
  catch (err) {
    console.log(err);
    res.json({ status: 400, msg: err.message })
  }
})

app.post("/admin/search",async(req,res)=>{
  try{
    let search_query = req.body.search
    const search = await comic_name_collection.aggregate([
    { $match: { comic_name: { $regex: new RegExp(`^${search_query}`, 'i') } } }, 
    { $sample: { size: 4 } } // Get 4 random documents
  ]).toArray();

  if(search.length<1){
    return res.json({status:404});
  }
  
  let respose_data = [];
  for(let a =0;a<search.length;a++){
    let comic_name = search[0].comic_name;
    let comic_id = search[0].comic_id;
    let obj = {comic_name,comic_id};
    respose_data.push(obj);
  }

  res.json({status:200,data:JSON.stringify(respose_data)});
  
  }
  catch(err){
    res.json({status:400,msg:"Can't search now!"})
  }
})

app.listen(8000, () => {
  console.log("server is running...")
})