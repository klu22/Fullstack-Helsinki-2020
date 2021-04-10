const http = require('http')

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')


app.connectToMongo()
const server = http.createServer(app.createApp())

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})