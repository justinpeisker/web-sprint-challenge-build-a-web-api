const Actions = require('./actions-model');

async function actionIdValidation (req, res, next) {
    try{
        const searchedAction =  await Actions.get(req.params.id)
        if(!searchedAction){
            next({status: 404, message: `Cannot find action ${req.params.id}!`})
        } else {
            req.searchedAction = searchedAction
            next()
        }
    }catch (err) {
        next(err)
    }
}

module.exports = {
    actionIdValidation,
}
