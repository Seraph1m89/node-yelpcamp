const express = require("express"),
      router = express.Router({mergeParams: true}),
      middleware = require("../middleware"),
      Camp = require("../models/camp"),
      Comment = require("../models/comment"),
      sanitizer = require("sanitizer");

router.post("/", middleware.isLoggedIn, (req, res) => {
   Camp.findById(req.params.id, (err, camp) => {
       req.body.text = sanitizer.sanitize(req.body.text);
       if(err) {
           console.error(err);
           req.flash("error", err.message);
           res.redirect(`/camps/${req.params.id}`);
       } else {
           var comment = {
               text: req.body.comment.text,
               author: {
                   username: req.user.username,
                   id: req.user._id
               }
           }

           Comment.create(comment, (err, comment) => {
               if(err) {
                   console.error(err);
                   req.flash("error", err.message);
               } else {
                   camp.comments.push(comment._id);
                   camp.save();
               }
               res.redirect(`/camps/${req.params.id}`);
           });
       }
   });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    Camp.findById(req.params.id, (err, camp) => {
        if(err) {
            console.error(err);
            req.flash("error", err.message);
            res.redirect(`/camps/${req.params.id}`);
        } else {
            res.render("comments/new", {camp}); 
        }
    });
});

router.get("/:commentId/edit", middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res) => {
    res.render("comments/edit");
});

router.put("/:commentId", middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res) => {
    res.locals.comment.update(req.body.comment, (err) => {
        if(err) {
            console.log(err);
            req.flash("error", err.message);
        }
        res.redirect(`/camps/${req.params.id}`);
    });
});

router.delete("/:commentId", middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res) => {
    res.locals.comment.remove((err) => {
       if(err) {
           console.error(err);
           req.flash("error", err.message);
       } 
       res.redirect(`/camps/${req.params.id}`);
    });
});

module.exports = router;