/////// DEPENDENCIES //////
const express = require('express')
const layouts = require('express-ejs-layouts');
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const DATABASE_URL = process.env.DATABASE_URL
const Gallery = require('./models/gallery.js')


////DATEBASE CONNECTION ERROR/SUCCESS
// CALLBACK FUNCTIONS FOR VARIOU
const db = mongoose.connection
mongoose.connect(DATABASE_URL)
db.on('error', (err) => console.log(err.message + 'is mongo not runnning?'))
db.on('connected', () => console.log('mongo connected'))
db.on('disconnected', () => console.log('mongo disconnected'))

////// MIDDLEWARE //////
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(require('method-override')('_method'));
app.use(express.static(__dirname + '/public'));
app.use(layouts);


/////INDUCES ROUTES/////
const gallerySeed = require('./models/gallerySeed.js')
// SEED ROUTE
app.get('/gallery/seed', (req, res) => {
  Gallery.deleteMany({}, (error, allPhotos) => {})
  Gallery.create(gallerySeed, (error, data) => {
    console.log(error, data)
    res.redirect('/gallery')
  })
})

// Home Route 
app.get('/', (req, res) => {
  res.render('home.ejs')
})

// INDEX ROUTE 
app.get('/gallery', (req, res) => {
  Gallery.find({}, (error, allPhotos) => {
    res.render('index.ejs', {
      allPhotos : allPhotos
    })
    // res.send('index.ejs', {
    //   photos: allPhotos
    })
  })
  
  // NEW ROUTE 
  app.get('/gallery/new', (req, res) => {
    res.render('new.ejs')
  })

  // DELETE ROUTE
app.delete('/gallery/:id', (req, res) => {
  Gallery.findByIdAndDelete(req.params.id, (err, deletedGallery) => {
    res.redirect('/gallery')
  })
})

// Update Route 
app.put('/gallery/:id', ((req, res) => {
  const newPhoto = {
    name: req.body.name,
    image: req.body.image,
    location: req.body.location
  }


Gallery[req.params.id] = newPhoto
res.redirect('/gallery')
})
)


// CREATE ROUTE 
app.post('/gallery', (req, res) => {
  Gallery.create(req.body, (error, createdGallery) => {
    res.redirect('/gallery')
  })
})

// EDIT ROUTE
app.get('/gallery/:id/edit', (req, res) => {
  Gallery.findById(req.params.id, (err, foundPhoto) => {
    res.render('edit.ejs', {
      photo: foundPhoto
    })
  })
} )


//  SHOW ROUTE
app.get('/gallery/:id', (req, res) => {
  Gallery.findById(req.params.id, (err, foundPhoto) => {
    console.log(foundPhoto)
    res.render('show.ejs', {
      photo: foundPhoto
    })
  })
})
///////// Listener ////////
const PORT = process.env.PORT
app.listen(PORT, () => 
console.log('yep'))
