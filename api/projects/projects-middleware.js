const Projects = require('./projects-model');

async function projectIdValidation (req, res, next) {
    try{
        const searchedProject =  await Projects.get(req.params.id)
        if(!searchedProject){
            next({status: 404, message: `Cannot find project ${req.params.id}!`})
        } else {
            req.searchedProject = searchedProject
            next()
        }
    }catch (err) {
        next(err)
    }
}

module.exports = {
    projectIdValidation,
}