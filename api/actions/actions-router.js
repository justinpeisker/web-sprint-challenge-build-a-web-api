const express = require('express');
const router = express.Router();
const Actions = require('./actions-model');

router.get('/', (req, res) => {
    Actions.get()
    .then(foundActions => {
        res.json(foundActions)
    })
    .catch(err => {
        res.status(500).json({
            message: "Problem retreiving actions!",
        })
    }) 
})

router.get('/:id', (req,res) => {
    Actions.get(req.params.id)
    .then(action => {
        if(action){
            res.status(200).json(action)
        } else {
            res.status(404).json({
                message: "Cannot find a action with that id!"
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "Problem retreiving your actions!",
        })
    })
})

router.post('/', (req,res) => {
    const { project_id, description, notes } = req.body
    if(!project_id || !description || !notes){
        res.status(400).json({
            message: "Project id, description, and notes are required!"
        })
    } else {
        Projects.insert({project_id, description, notes})
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
    if(!name || !description || !completed){
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
        const action = await Actions.get(req.params.id)
        if(!action){
            res.status(404).json({
                message: "The action with that ID does not exist!"
            })
        } else {
            const deletedAction = await Actions.remove(req.params.id)
            res.json(action)
        }
    }
    catch (err) {
        res.status(500).json({
            message: "Problem updating your actions!",
        })
    }
})

module.exports = router

