require("express-async-errors");
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const {xss}= require("express-xss-sanitizer");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;
const db_uri = process.env.DB_URI;

//utils
const connectDB = require("./utils/connectDB");

//middlewares
const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFoundMiddleware = require("./middlewares/not-found");
const authUser = require("./middlewares/authentication");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("./public"));

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many request from this IP, please try again later.",
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(xss());
app.use(helmet());

//routes
const publicRoute = require("./routes/public");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const diaryRoute = require("./routes/diary");

app.get("/", (req,res)=>{
  res.send("DIARY API made by: Zay");
})

app.use(publicRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", authUser, userRoute);
app.use("/api/v1/diary", authUser, diaryRoute);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const start = async (req, res) => {
  await connectDB(db_uri);
  app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}/`);
  });
};

start();
