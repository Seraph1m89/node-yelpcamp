const mongoose = require("mongoose");

var campSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"   
        }
    ],
    author: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
});
var Camp = mongoose.model("Camp", campSchema);

module.exports = Camp;