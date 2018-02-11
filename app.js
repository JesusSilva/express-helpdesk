const express = require("express");
const path = require("path");
const debug = require('debug')('project:app');
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const passportConfig = require("./passport")
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const flash = require("connect-flash");
const postRoutes = require("./routes/post");
const routePost = require("./routes/post");

// Conectando con la BBDD mongo
const {dbURL} = require('./config');
mongoose.connect(dbURL)
.then(()=> {
  debug(`Connected to db ${dbURL}`)
})
.catch(e => console.log(e)) 

const app = express();



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/main-layout");
app.use(expressLayouts);

app.use("/post", postRoutes);

app.use(
  session({
    secret: "tumblrlabdev",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/lib/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/lib/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));


const index = require("./routes/index");
const authRoutes = require("./routes/authentication");
app.use("/", index);
app.use("/", authRoutes);
app.use('/', postRoutes);
app.use('/post',routePost);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
