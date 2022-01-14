const express = require('express');
const router = express.Router();
const Projects = require('./projects-model');
const {projectIdValidation} = require('./projects-middleware')

router.get('/', (req, res, next) => {
    Projects.get()
    .then(foundProjects => {
        res.json(foundProjects)
    })
    .catch(next) 
})

router.get('/:id', projectIdValidation,(req, res, next) => {
    Projects.get(req.params.id)
    .then(project => {
        res.status(200).json(project)
    })
    .catch(next)
})

router.post('/', (req, res, next) => {
    const { name, description, completed } = req.body
    if(!name || !description){
        res.status(400).json({
            message: "Name and description are required!"
        })
    } else {
        Projects.insert({name, description, completed})
        .then(({id}) => {
            return Projects.get(id)
        })
        .then(newProject => {
            res.status(201).json(newProject)
        })
        .catch(next)    
    }
})

router.put('/:id', projectIdValidation, (req, res, next) => {
    const { name, description, completed } = req.body
    if(!name || !description){
        res.status(400).json({
            message: "Name, description and completion status are required!"
        })
    } else {
       Projects.get(req.params.id)
       .then(() => {
            return Projects.update(req.params.id, req.body)
       })
       .then(project => {
           if(project){
               return Projects.get(req.params.id)
            } 
       })
       .then(updatedProject => {
           if(updatedProject){
               res.json(updatedProject)
           }
       })
       .catch(next)
    }
})

router.delete('/:id', projectIdValidation, async (req, res, next) => {
    try{
        const deletedProject = await Projects.remove(req.params.id)
        res.json(project)
    }
    catch (err) {
        next(err)
    }
})

router.get('/:id/actions', projectIdValidation, async (req, res, next) => {
    try{
        const actions = await Projects.getProjectActions(req.params.id)
        res.json(actions)
    }
    catch (err) {
       next(err)
    }
})
module.exports = router
