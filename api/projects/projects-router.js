const express = require('express');
const router = express.Router();
const Projects = require('./projects-model');

router.get('/', (req, res) => {
    Projects.get()
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
        .catch(err => {
            res.status(500).json({
                message: "Problem adding your project!",
            })
        })    
    }
})

router.put('/:id', (req,res) => {
    const { name, description, completed } = req.body
    if(!name || !description){
        res.status(400).json({
            message: "Name and description are required!"
        })
    } else {
       Projects.get(req.params.id)
       .then(validID => {
           if(!validID){
               res.status(404).json({
                   message: "Project with that ID not found!"
               })
           } else {
               return Projects.update(req.params.id, req.body)
           }
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
       .catch(err => {
            res.status(500).json({
                message: "Problem updating your projects!",
            })
        })
    }
})

router.delete('/:id', async (req,res) => {
    try{
        const project = await Projects.get(req.params.id)
        if(!project){
            res.status(404).json({
                message: "The project with that ID does not exist!"
            })
        } else {
            const deletedProject = await Projects.remove(req.params.id)
            res.json(project)
        }
    }
    catch (err) {
        res.status(500).json({
            message: "Problem updating your projects!",
        })
    }
})

router.get('/:id/actions', async (req,res) => {
    try{
        const project = await Projects.get(req.params.id)
        if(!project){
            res.status(404).json({
                message: "The project with that ID does not exist!"
            })
        } else {
            const actions = await Projects.getProjectActions(req.params.id)
            res.json(actions)
        }
    }
    catch (err) {
        res.status(500).json({
            message: "Problem retrieving your projects!",
        })
    }
})
module.exports = router
