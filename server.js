const express = require('express')
const db = require('./models')
const app = express()
const roleRoutes = require('./routes/role-routes')
const userRoutes = require('./routes/user-routes')
const refereeRoutes = require('./routes/referee-routes')
const courtRoutes = require('./routes/court-routes')
const workoutAndTestRoutes = require('./routes/workoutAndTest-routes')
const testResultRoutes = require('./routes/testResult-routes')



app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use('/api/role',roleRoutes)
app.use('/api/user',userRoutes)
app.use('/api/referee',refereeRoutes)
app.use('/api/court',courtRoutes)
app.use('/api/workoutAndTest',workoutAndTestRoutes)
app.use('/api/testResult',testResultRoutes)

db.sequelize.sync({alter:true}).then(()=>{
    app.listen(3000,()=>console.log('server listening in port 3000'))
})