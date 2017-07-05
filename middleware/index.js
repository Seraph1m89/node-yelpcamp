const Camp = require("../models/camp"),
      Comment = require("../models/comment");

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

const checkCommentOwnership = (req, res, next) => {
    Comment.findById(req.params.commentId, (err, comment) => {
        if(err) {
            console.error(err);
            req.flash("error", err.message);
            return res.redirect("back");
        }
        if(comment.author && comment.author.id.equals(req.user._id)) {
            Camp.findById(req.params.id, (err, camp) => {
                if(err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
                res.locals.camp = camp;
                res.locals.comment = comment;
                next();
            });
        } else {
            req.flash("error", "Only author of this comment can delete it");
            return res.redirect("back");
        }
    });
}

const checkCampOwnership = (req, res, next) => {
    Camp.findById(req.params.id, (err, camp) => {
        if(err) {
            console.error(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if(camp.author.id && camp.author.id.equals(req.user._id)) {
                res.locals.camp = camp;
                next();
            } else {
                req.flash("error", "You must be logged in as author of this camp");
                res.redirect("back")
            }
        }
    });
}

module.exports = {isLoggedIn, checkCommentOwnership, checkCampOwnership}