const router = require("express").Router(),
      middleware = require("../middleware"),
      Camp = require("../models/camp"),
      sanitizer = require("sanitizer");

router.get("/", function(req, res) {
    Camp.find({}, (err, data) => {
        if(err) {
            console.error(err);
            req.flash("error", err.message);
            res.redirect("/");
        } else {
            res.render("camps/index", {data});
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    var camp = req.body.camp;
    camp.description = sanitizer.sanitize(camp.description);
    camp.author = {
        username: req.user.username,
        id: req.user._id
    }
    
    Camp.create(camp, (err, item) => {
        if(err) {
            console.error(err);
            req.flash("error", err.message);
        }
        res.redirect("/camps");
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("camps/new");
});

router.get("/:id", (req, res) => {
    Camp.findById(req.params.id).populate("comments").exec((err, item) => {
        if(err) {
            console.error(err);
            req.flash("error", err.message);
            res.redirect("/camps");
        } else {
            res.render("camps/show", {item});
        }
    });
});

router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampOwnership, (req, res) => {
    res.render("camps/edit");
});

router.put("/:id", middleware.isLoggedIn, middleware.checkCampOwnership, (req, res) => {
    res.locals.camp.update(req.body.camp, (err) => {
        if(err) {
            console.error(err);
            req.flash("error", err.message);
        }
        res.redirect(`/camps/${req.params.id}`);
    });
});

router.delete("/:id", middleware.isLoggedIn, middleware.checkCampOwnership, (req, res) => {
    res.locals.camp.remove((err) => {
       if(err) {
           console.error(err);
           req.flash("error", err.message);
       } 
       res.redirect("/camps");
    });
});

module.exports = router;