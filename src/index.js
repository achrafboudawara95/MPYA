const express = require ('express')
require ('./db/mongoose')
const AdminRouter = require('./routers/admin')
const UserRouter = require('./routers/user')
const DocumentRouter = require('./routers/document')
const ViewRouter = require('./routers/view')
const SaveRouter = require('./routers/save')

const app = express()
const port = process.env.PORT || 3000

app.listen(port ,() => {
    console.log('Server is up on port '+port)
})
app.use(express.json())
app.use(UserRouter)
app.use(DocumentRouter)
app.use(ViewRouter)
app.use(SaveRouter)
app.use(AdminRouter)