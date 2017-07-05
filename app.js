const express = require("express"),
      bodyParser = require("body-parser"), 
      app = express(),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      expressSession = require("express-session"),
      mongoose = require("mongoose"),
      User = require("./models/user"),
      seedDB = require("./seeds"),
      methodOverride = require("method-override"),
      flash = require("connect-flash");
      
const commentRoutes = require("./routes/comments"),
      campRoutes = require("./routes/camps"),
      authRoutes = require("./routes/auth"),
      indexRoutes = require("./routes/index");
      
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp")//.then(() => seedDB());

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(expressSession({
    secret: "This is my test project",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride("_method"));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.user = req.user;
    next();
});

app.use("/camps", campRoutes);
app.use("/camps/:id/comments", commentRoutes);
app.use(authRoutes);
app.use(indexRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("host is running");
});