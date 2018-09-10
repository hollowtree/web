const liveServer = require("live-server")
liveServer.start({
    port: 3000,
    open: true,
    ignore: 'node_modules',
    logLevel: 2,
})