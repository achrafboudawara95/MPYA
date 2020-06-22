const User = require ('./models/user')
require ('./db/mongoose')

const init = async () => {
    const admin = new User({
        username: 'admin',
        email: 'admin@mpya.com',
        password: 'MPYAADMIN 2020',
        role: 'admin'
        })
    await admin.save({ validateBeforeSave: false }).then(()=> {return 'user saved'} )
}
init().then(() => {
    console.log('completed')
    return
})