const express = require('express');
const path = require('path');

const app = express();

// Middleware to restrict access to static files


// Serve static files from the /data folder
app.use('/data', express.static(path.join(__dirname, 'data')));

// Sample route to render the /read/comic page

app.get("/",(req,res)=>{
    res.send("hi");
})

app.get('/read/comic', (req, res) => {
  res.send(`
    <html>
      <body style="background: #000; color: #fff; text-align: center;">
        <h1>Read Comic</h1>
        <img src="/data/AlA5iY8gEi/img.jpg" alt="Comic Image" />
      </body>
    </html>
  `);
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
