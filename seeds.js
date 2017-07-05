const mongoose = require("mongoose"),
      Camp = require("./models/camp"),
      Comment = require("./models/comment");

var description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed ex quis orci pretium pharetra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus bibendum orci sit amet luctus lobortis. Donec blandit lorem laoreet dui hendrerit, ut lacinia dui mattis. Aliquam ac nibh mattis mi rhoncus ultrices vehicula vitae tellus. Duis vestibulum risus id interdum viverra. Nulla gravida pulvinar rutrum. Phasellus id sapien eget magna pulvinar hendrerit semper et nisi. Integer sagittis diam aliquet cursus facilisis. Morbi condimentum erat vel bibendum lobortis. Nam finibus urna in lectus tincidunt sagittis. Aenean non augue sed est vestibulum convallis vitae vitae velit. Ut posuere massa id arcu elementum, et blandit tortor ultrices. Cras eu mi nisi. Praesent egestas tempus justo, ut bibendum mauris blandit a.\r\nPhasellus feugiat iaculis est, nec vestibulum lectus consectetur vel. Aliquam finibus est vel pulvinar gravida. Aliquam tincidunt est id sem egestas, id elementum erat viverra. Morbi imperdiet orci sollicitudin massa aliquet consequat. Morbi tincidunt eros erat, non consectetur nisl imperdiet a. Etiam eget vehicula ligula, quis dictum libero. Nulla facilisi. Phasellus est lorem, sodales in nisl eu, hendrerit suscipit eros. Sed ligula leo, feugiat in vehicula in, bibendum non nulla."

var dbMock = [
        {name: "Trololo camp", image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg", description},
        {name: "Hey-ho camp", image: "https://farm3.staticflickr.com/2919/14554501150_8538af1b56.jpg", description},
        {name: "Pirojok camp", image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg", description},
        {name: "Kolobok camp", image: "https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg", description}
]

var cleanup = () => {
    return new Promise((resolve, reject) => {
        Camp.remove({}, (err) => {
            if(err) {
                reject(err)
            } else {
                resolve("Done");
            }
        });
    });
}

var populate = () => {
    dbMock.forEach((seed) => {
                 Camp.create(seed, (err, camp) => {
                    if(err) {
                        console.error(err);
                    } else {
                        Comment.create({
                             text: "Great place for trulala",
                             author: {
                                 username: "Trulala"
                             }
                         }, (err, comment) => {
                            if(err) {
                                console.error(err);
                            } else {
                                camp.comments.push(comment);
                                camp.save();
                            }
                        });
                    }
                });
        });
}

var seed = () => {
    cleanup()
    .then(_ => {populate()}).catch(err => console.error(err));
}

module.exports = seed; 




// var dbMock = [
//         {name: "Trololo camp", image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
//         {name: "Hey-ho camp", image: "https://farm3.staticflickr.com/2919/14554501150_8538af1b56.jpg"},
//         {name: "Pirojok camp", image: "https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg"},
//         {name: "Kolobok camp", image: "https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg"},