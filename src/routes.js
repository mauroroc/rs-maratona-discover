const express = require('express')
const { reset } = require('nodemon')
const routes = express.Router()

const views = __dirname + '/views/'

const profile = {
    name: "Teobaldo"
}

const jobs = [{
    id: 1,
    name: 'Seed',
    date_due: "10/12/2021",
    price: 100.00,
    status: 'Em andamento',
    created_at: Date.now()
}];

routes.get('/', (req, res) => res.render(views + 'index', { jobs }))
routes.get('/job', (req, res) => res.render(views + 'job'))
routes.post('/job', (req, res) => {
    const lastId = jobs[jobs.length-1]?.id || 1

    jobs.push({
        id: lastId + 1,
        name: req.body.name,
        date_due: "10/12/2021",
        price: 100.00,
        status: 'Falta iniciar',
        created_at: Date.now()
    })
    console.log(jobs)
    return res.redirect('/')
})
routes.get('/job/edit', (req, res) => res.render(views + 'job-edit'))
routes.get('/profile', (req, res) => res.render(views + 'profile', { profile: profile }))

module.exports = routes;