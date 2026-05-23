require("dotenv").config()
const express = require('express')
const { connectDb } = require('./config/databse')
const {createServer} = require("http");
const app = express()
const port = process.env.PORT;



app.get('/', (req, res) => res.send('Hello World!'))

const server = createServer(app);


connectDb().then(() => {
     console.log("Database is connected");
    server.listen(port, () => {
      console.log(`Example listening on port ${port}`);
    });
}).catch((err) => {
    
});
