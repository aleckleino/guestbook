const { response, request } = require('express')
var express = require('express')
var fs = require('fs')
var app = express()
//Require the module requires for using form data
var bodyParser = require('body-parser')
const { resourceLimits } = require('worker_threads')
app.use(bodyParser.urlencoded({ extended: true })) //for parsing

// Let's take bodyParser in use in express application
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('./public'))

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html')
  console.log('Path: ' + __dirname)
})

//Printing json data
app.get('/guestbook', function (request, response) {
  response.sendFile(__dirname + '/public/guestbook.html')
})

//adding new message
app.get('/newmessage', function (request, response) {
  response.sendFile(__dirname + '/public/newmessage.html')
})

// Route for form sendind the POST data
app.post('/newmessage', function (req, res) {
  //Load the existing data from a file
  var data = require(__dirname + '/public/data.json')
  //creating a new json object and add it tp existing data variotion

  data.push({
    username: req.body.username,
    country: req.body.country,
    date: Date(),
    message: req.body.message,
  })

  //Conver the Json object to a string form
  var jsonStr = JSON.stringify(data)

  //Write data to the file
  fs.writeFile('./public/data.json', jsonStr, (err) => {
    if (err) throw err
    console.log('New message is saved!')
  })
})

//AJAX
app.get('/ajaxform', function (request, response) {
  response.sendFile(__dirname + '/public/ajaxform.html')
})

app.post('/savemessage', function (request, response) {
  var data = require(__dirname + '/public/data.json')
  let newMessage = {
    username: request.body.username,
    country: request.body.country,
    date: Date(),
    message: request.body.message,
  }
  console.log(newMessage)
  data.push(newMessage)
  //Conver the Json object to a string form
  var jsonStr = JSON.stringify(data)

  //Write data to the file
  fs.writeFile('./public/data.json', jsonStr, (err) => {
    if (err) throw err
    console.log('New ajax message is saved!')
  })

  //parse result in the table
  var results = '<table border="1">'
  for (var i = 0; i < data.length; i++) {
    results +=
      '<tr>' +
      '<td>' +
      data[i].username +
      '</td>' +
      '<td>' +
      data[i].country +
      '</td>' +
      '<td>' +
      data[i].message +
      '</td>' +
      '</tr>'
  }
  response.send(results)
})
//AJAX END

//error 404
app.get('*', function (req, res) {
  res.status(404).send('Cannot find the requested page')
})


app.listen(process.env.PORT || 8081, function () {
    console.log('App listening on port 8081');
});
