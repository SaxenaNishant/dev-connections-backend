const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const connectDb = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ limit: "16kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

app.use("/health-check", (req, res)=>{
  res.status(200).send("System is up!!!")
})

connectDb()
  .then(() => {
    console.log("Mongodb connected successfully!!");
    app.listen(8000, () =>
      console.log("App is listening on port 8000")
    ); //process.env.PORT
  })
  .catch((err) => {
    console.log(
      "Mongodb connection error. Please make sure Mongodb is running ",
      err
    );
  });
