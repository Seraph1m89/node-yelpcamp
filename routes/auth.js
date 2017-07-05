const express = require("express"),
      router = express.Router(),
      User = require("../models/user"),
      passport = require("passport"),
      middleware = require("../middleware"),
      Camp = require("../models/camp");

router.get("/register", (req, res) => {
    res.render("authentication/register", {user: req.user});
});

router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.error(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/camps");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("./authentication/login")
});

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), (req, res) => {
    req.flash("success", `Wellcome back, ${req.user.username}`);
    res.redirect("/camps");
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You've logger out, come again soon!");
    res.redirect("/");
});

module.exports = router;