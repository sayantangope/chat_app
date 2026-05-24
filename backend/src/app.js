const express = require("express");
require("dotenv").config();
const { connectDb } = require("./config/database");
const { createServer } = require("http");
const { clerkMiddleware, getAuth  } =require("@clerk/express")
const { clerkClient } = require("@clerk/express");
const userAuth = require("./middlewares/auth");
const userRouter = require("./routes/user");



const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(clerkMiddleware({

  authorizedParties: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
  ]
}));

// Use requireAuth() to protect this route
// If user isn't authenticated, requireAuth() will redirect back to the homepage
app.get("/",(req,res)=> {
  res.send("Welcome to the homepage")
})



app.use("/",userAuth,userRouter)


app.get('/protected', userAuth, async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req)

  const auth = getAuth(req);
  console.log("🔍 Auth debug:", auth);           // see full auth object
  console.log("🔑 Header:", req.headers.authorization); // see what token arrived
  // / Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId)

  return res.json({ user })
})


app.get('/sign-in', (req, res) => {
  res.render('sign-in')
})



const server = createServer(app);


connectDb()
  .then(() => {
    console.log("Database is connected");
    server.listen(port, () => {
      console.log(`Example listening on port ${port}`);
    });
  })
  .catch((err) => {});
