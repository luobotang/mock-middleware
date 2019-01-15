var path = require('path')
var express = require('express')
var mockMiddleware = require('../')

var app_common = express()
app_common.use(mockMiddleware(path.join(__dirname, 'mock'), {user: false}))
app_common.use(express.static(path.join(__dirname, 'app')))
app_common.listen(8888, () => console.log('common on 8888...'))

var app_user = express()
app_user.use(mockMiddleware(path.join(__dirname, 'mock'), {user: true}))
app_user.use(express.static(path.join(__dirname, 'app')))
app_user.listen(8889, () => console.log('user on 8889...'))