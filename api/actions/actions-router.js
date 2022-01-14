const express = require('express');
const router = express.Router();
const Actions = require('./actions-model');
const { actionIdValidation } = require('./actions-middlware')

router.get('/', (req, res, next) => {
    Actions.get()
    .then(foundActions => {
        res.json(foundActions)
    })
    .catch(next) 
})

router.get('/:id', actionIdValidation, (req, res, next) => {
    Actions.get(req.params.id)
    .then(action => {
        res.json(action)
    })
    .catch(next)
})

router.post('/', (req, res, next) => {
    const { project_id, description, notes, completed } = req.body
    if(!project_id || !description || !notes){
        res.status(400).json({
            message: "Project id, description, and notes are required!"
        })
    } else {
        Actions.insert({project_id, description, notes, completed})
        .then(({id}) => {
            return Actions.get(id)
        })
        .then(newAction => {
            res.status(201).json(newAction)
        })
        .catch(next)    
    }
})

router.put('/:id', actionIdValidation, (req, res, next) => {
    const { project_id, description, notes, completed } = req.body
    if(!project_id || !description || !notes){
        res.status(400).json({
            message: "Name and description are required!"
        })
    } else {
       Actions.get(req.params.id)
       .then(() => {
            return Actions.update(req.params.id, req.body)
        })
       .then(project => {
            if(project){
               return Actions.get(req.params.id)
            } 
       })
       .then(updatedAction => {
           if(updatedAction){
               res.json(updatedAction)
           }
       })
       .catch(next)
    }
})

router.delete('/:id',actionIdValidation, async (req, res, next) => {
    try{
        const deletedAction = await Actions.remove(req.params.id)
        res.json(deletedAction)
    }
    catch (err) {
       next(err)
    }
})

module.exports = router

