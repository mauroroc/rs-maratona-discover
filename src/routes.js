const express = require('express')
const { reset } = require('nodemon')
const routes = express.Router()

const views = __dirname + '/views/'

const profile = {
    name: "Teobaldo"
}

routes.get('/', (req, res) => res.render(views + 'index'))
routes.get('/job', (req, res) => res.render(views + 'job'))
routes.get('/job/edit', (req, res) => res.render(views + 'job-edit'))
routes.get('/profile', (req, res) => res.render(views + 'profile', { profile: profile }))

module.exports = routes;