const express = require ('express')
require ('./db/mongoose')
const AdminRouter = require('./routers/admin')
const UserRouter = require('./routers/user')
const DocumentRouter = require('./routers/document')
const ViewRouter = require('./routers/view')
const SaveRouter = require('./routers/save')
const versionRouter = require('./routers/version')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../config/swagger-api-docs.json')

const app = express()
const port = process.env.PORT || 3000

app.listen(port ,() => {
    console.log('Server is up on port '+port)
})
app.use(express.json())
var swaggerOptions = {
    customCss: '.swagger-ui .topbar, .swagger-ui .version-stamp { display: none !important }',
    customSiteTitle: "MPYA Api Docs",
    customfavIcon: "/assets/favicon.ico"
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions))
app.use(UserRouter)
app.use(DocumentRouter)
app.use(ViewRouter)
app.use(SaveRouter)
app.use(AdminRouter)
app.use(versionRouter)