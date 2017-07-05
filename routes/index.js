const router = require("express").Router();

router.get("/", function(req, res) {
   res.render("home"); 
});

router.get("*", function(req, res) {
   res.send("Page not found"); 
});

module.exports = router;