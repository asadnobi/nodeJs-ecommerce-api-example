const mongoose = require('mongoose');

// connect to the database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

// check mongoose connection
mongoose.connection.on("open", () => {
    console.log(`[STATUS] CONNECTED TO THE DATABASE`)
})

mongoose.connection.on("error", () => {
    console.log(`[STATUS] FAILED TO CONNECT TO THE DATABASE`)
})
