const express = require('express')
const { reset } = require('nodemon')
const routes = express.Router()

const views = __dirname + '/views/'

const Profile = {
    data: {
        name: "Teobaldo",
        hour_value: 50,
        salary: 3000,
        days_week: 5,
        hour_days: 5,
        vacation_week: 4,
    },
    controllers: {
        index(req, res) {
            return res.render(views + 'profile', { profile: Profile.data })
        },
        update(req, res) {
            const data = req.body
            const weeksPerYear = 52
            const weeksPerMonth = (weeksPerYear - data["vacation_week"]) / 12
            const weekTotalHours = data["hour_days"] * data["days_week"]
            const monthlyTotalHours = weekTotalHours * weeksPerMonth
            data["hour_value"] = data["salary"] / monthlyTotalHours
            Profile.data = data
            return res.redirect('/profile')
        }
    }
    
}

const Job = {
    data: [
        {
            id: 1,
            name: 'Seed',
            created_at: Date.now(),
            total_hours: 40,
            daily_hours: 2,
        },
        {
            id: 2,
            name: 'Seed2',
            created_at: Date.now(),
            total_hours: 20,
            daily_hours: 4,
        }
    ],
    controllers: {
        index(req, res) {
            const updatedJobs = Job.data.map((job) => {
                const remaining = Job.services.remainingDays(job)
                const status = remaining <= 0 ? 'done' : 'progress'
                return {
                    ...job,
                    remaining,
                    status,
                    price: Job.services.calculatePrice(job, Profile.data.hour_value)
                }
            })
            
            return res.render(views + 'index', { jobs: updatedJobs })
        },
        create(req, res) {
            return res.render(views + 'job')
        },
        save(req, res) {
            const lastId = Job.data[Job.data.length-1]?.id || 1
            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                total_hours: req.body.total_hours,
                daily_hours: req.body.daily_hours,
                created_at: Date.now()
            })
            console.log(Job.data)
            return res.redirect('/')
        },
        edit (req, res) {
            const jobId = req.params.id
            const job = Job.data.find(job => Number(job.id) === Number(jobId))
            if (!job) return res.send('Job not found!')
            
            job.price = Job.services.calculatePrice(job, Profile.data.hour_value)
            return res.render(views + 'job-edit', { job })
        },
        update (req, res) {
            const jobId = req.params.id
            const job = Job.data.find(job => Number(job.id) === Number(jobId))
            if (!job) return res.send('Job not found!')

            const updatedJob = {
                ...job,
                name: req.body.name,
                total_hours: req.body.total_hours,
                daily_hours: req.body.daily_hours,
            }
            Job.data = Job.data.map(job => {
                if(Number(job.id) === Number(jobId)) {
                    job = updatedJob
                }
                return job
            })
            res.redirect('/job/' + jobId)
        },
        delete (req, res) {
            const jobId = req.params.id
            
            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            return res.redirect('/')
        }
    },
    services: {
        remainingDays(job) {
            const remainingDays = (job["total_hours"] / job["daily_hours"]).toFixed()
            const createdDate = new Date(job.created_at)
            const dayDue = createdDate.getDate() + Number(remainingDays)
            const dateDueMs = createdDate.setDate(dayDue)
            const timeDiffMs = dateDueMs - Date.now()
            const dayMs = 1000 * 60 * 60 * 24
            const dayDiff = Math.floor(timeDiffMs / dayMs)
            return dayDiff 
        },
        calculatePrice(job, hourValue) {
            return hourValue * job.total_hours
        }
    }
}

routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.edit)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)

module.exports = routes;