var express = require('express')
var config = require('config')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var path = require('path')

var app = express()
var port = process.env.PORT || 3000
app.listen(port)

var connectionString = process.env.MONGODB_URI ? process.env.MONGODB_URI : config.get('connectionString')
mongoose.connect(connectionString, function(err) {
  if (err) {
    throw err
  }
  console.log('connected to database')
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

console.log('server started')

var Gnote = require('./models/gnote')

app.get('/', (req, res, next) => {
    res.render('index', { title: 'GNOTER' })
})

app.get('/index', (req, res, next) => {
    res.redirect('/')
})

app.post('/get', (req, res, next) => {
    Gnote.find({ key: req.body.key.toLowerCase() }, function (err, data) {
        if (err) {
            res.status(404).send({ error: 'key does not exist' })
        } else {
            var gnote = data[0]
            if (gnote && (req.body.passcode || gnote.passcode)) {
                if (req.body.passcode == gnote.passcode) {
                    res.send(gnote)
                } else {
                    res.status(401).send({ error: 'key or passcode is incorrect' })
                }
            } else {
                res.send(gnote)
            }
        }
    })
})

app.post('/save', (req, res, next) => {
    var gnote = new Gnote(req.body)
    gnote.save(function (err) {
        if (err) {
            console.log(err.message)
            res.status(500).send({ error: 'key alreay in use' })
        } else {
            res.status(200).send({ message: 'saved' })
        }
    })
})

app.post('/check', (req, res, next) => {
    Gnote.find({ key: req.body.key.toLowerCase() }, function (err, data) {
        var gnote = data[0]
        if (gnote) {
            res.status(200).send({ error: 'key used' })
        } else {
            res.status(200).send({ message: 'key available' })
        }
    })
})
