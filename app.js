require('dotenv').config()
var fs = require('fs')
const express = require('express')
const app = express()
const port = process.env.PORT
const controller = require('./controller/controller.js');
var bodyParser = require('body-parser')
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/avatar')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + ".png")
  }
})
var upload = multer({ storage: storage })

app.set('view engine','pug');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'));

app.get('/', controller.index);
app.get('/login', controller.login);
app.get('/register', controller.register);
app.post('/save', upload.single('avatar'), controller.save);
app.post('/save_post', controller.save_post);
app.post('/check', controller.check);
app.get('/profile', controller.profile);
app.get('/exit', controller.exit);
app.post('/edit', controller.edit);
app.post('/save_edit',upload.single('avatar'), controller.save_edit);
app.post('/search', controller.search);
app.post('/all', controller.all);
app.get('/styles_example', controller.styles_example);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
// asdasdasdasd
