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
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  try {
    const urlObj = new URL(originalUrl);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }

    const shortUrl = id++;
    urlDatabase[shortUrl] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });

  } catch (error) {
    res.json({ error: 'invalid url' }); // <-- lowercase 'invalid url' is what FCC expects
  }
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = parseInt(req.params.short_url); // fix type mismatch
  const originalUrl = urlDatabase[short_url];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
