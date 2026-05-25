const express = require("express");
require("dotenv").config();
const { connectDb } = require("./config/database");
const { createServer } = require("http");
const { clerkMiddleware, getAuth } = require("@clerk/express");
const { clerkClient } = require("@clerk/express");
const userAuth = require("./middlewares/auth");
const userRouter = require("./routes/user.route");
const requestRouter = require("./routes/request.route");
const profileRouter = require("./routes/profile.route");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(
  clerkMiddleware({
    authorizedParties: ["http://localhost:5173", "http://localhost:8080"],
  }),
);

// Use requireAuth() to protect this route
// If user isn't authenticated, requireAuth() will redirect back to the homepage
app.get("/", (req, res) => {
  res.send("Welcome to the homepage");
});

app.use("/", userAuth, userRouter);
app.use("/",userAuth,profileRouter)
app.use("/",userAuth,requestRouter);



app.get("/sign-in", (req, res) => {
  res.render("sign-in");
});

const server = createServer(app);

connectDb()
  .then(() => {
    console.log("Database is connected");
    server.listen(port, () => {
      console.log(`Example listening on port ${port}`);
    });
  })
  .catch((err) => {});
