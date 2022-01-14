const express = require('express');
const router = express.Router();
const Projects = require('./projects-model');

router.get('/', (req, res) => {
    Projects.get(req.query)
    .then(foundProjects => {
        res.json(foundProjects)
    })
    .catch(err => {
        res.status(500).json({
            message: "Problem retreiving projects!",
        })
    }) 
})

router.get('/:id', (req,res) => {
    Projects.get(req.params.id)
    .then(project => {
        if(project){
            res.status(200).json(project)
        } else {
            res.status(404).json({
                message: "Cannot find a project with that id!"
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "Problem retreiving your projects!",
        })
    })
})

router.post('/', (req,res) => {
    
})

router.put('/:id', (req,res) => {

})

router.delete('/:id', (req,res) => {

})

router.get('/:id/actions', (req,res) => {

})
module.exports = router
