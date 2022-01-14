const express = require('express');
const server = express();
const projectsRouter = require('./projects/projects-router');
const actionsRouter = require('./actions/actions-router')
server.use(express.json())

server.use('/api/projects', projectsRouter)
server.use('/api/actions', actionsRouter)

server.get('/', (req, res) =>{
    res.send('Hello, just testing :)')
})

server.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: `Oops: ${err.message}`,
    })
  })

module.exports = server;
