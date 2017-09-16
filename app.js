var express = require('express')
var config = require('config')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var path = require('path')

var app = express()
var port = process.env.PORT || 3000
app.listen(port)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

console.log('server started')

app.get('/', (req, res, next) => {
    res.redirect('http://gisar.me/gnoter')
})