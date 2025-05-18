require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser'); //

app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

// Basic Configuration
const port = process.env.PORT || 3000;
const urlDatabase={};
let id= 1;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// app.post('/api/shorturl', async(req,res)=>{
//   const full_url= `${req.protocol}:// ${req.get('host')}${req.originalUrl}`
//   const short_url = full_url.split('/').pop();

//   // Check if the URL is valid
//   const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
//   if (!urlRegex.test(full_url)) {
//     return res.status(400).json({ error: 'Invalid URL' });
//   }   
//   res.json({
//     originalUrl:full_url,
//     shortUrl:short_url
  
//   })
// })
app.post('/api/shorturl', async(req,res)=>{
  // 
  const originalUrl = req.body.url; // Get the original URL from the request body
 
  
  try {
    const urlObj= new URL(originalUrl);
    if(!urlObj.protocol.startsWith('http')||!urlObj.protocol.startsWith('https')) { // Check if the URL starts with http or https
      return res.status(400).json({ error: 'Invalid URL' });
    }
  const shortUrl = id++; // Increment the ID for each new URL
  res.json({
    originalUrl: originalUrl,
    shortUrl: id
  })
}catch(error){
    return res.json({ error: 'Invalid URL' });
  }
})
app.get('/api/shorturl/<short_url>',async(req, res)=>{
  const short_url = req.params.short_url;

  const originalUrl = urlDatabase[short_url]; // Retrieve the original URL from the database

  if(originalUrl){ // Check if the original URL exists
    return res.redirect(originalUrl)
  }else{ // If the original URL does not exist
    return res.json({error: 'No short URL found for the given input' });
  }

})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
