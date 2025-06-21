const express = require('express');
const mongoose = require('mongoose');
const User = require('./models'); 
const { nanoid } = require('nanoid');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/urlshort', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.post('/postdata', async (req, res) => {
  try {
    const { urlFor, url } = req.body;


const existing = await User.findOne({ url });

if (existing) {
  existing.clickCount += 1; 
  await existing.save();    
  return res.json({
    message: 'URL already shortened',
    shortId: existing.shortId,
    shortUrl: `http://localhost:8001/getdata/${existing.shortId}`
  });
}


    const shortId = nanoid(7);

    const newUser = new User({ urlFor, url, shortId, clickCount : 1 });
    await newUser.save();

    res.status(201).json({
      message: 'Short URL created',
      shortId,
      shortUrl: `http://localhost:8001/getdata/${shortId}`
    });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/getdata/:id', async (req, res) => {
    try {
        const shortId = req.params.id;
        const existing = await User.findOne({ shortId });

        if (existing) {
            res.redirect(existing.url);
        } else {
            res.status(404).send("No data found for this ID");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.get('/analytics/:id', async (req, res) => {
  try {
    const shortId = req.params.id;
    const user = await User.findOne({ shortId });

    if (!user) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      shortId: user.shortId,
      clickCount: user.clickCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(8001, () => {
    console.log('Server running on port 8001');
});
