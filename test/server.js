var path = require('path')
var express = require('express')
var mockMiddleware = require('../')

var app = express()
app.use(mockMiddleware(path.join(__dirname, 'mock')))
app.use(express.static(path.join(__dirname, 'app')))
app.listen(8888, () => console.log('on 8888...'))
