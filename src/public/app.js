const { count } = require('console');
const http = require('http');
const mongoose = require("mongoose");
const options = {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true
};

mongoose
   .connect("mongodb://localhost:27017/blog", options)
   .then(connected => console.log(`Database connection established !`))
   .catch(err =>
      console.error(
         `There was an error connecting to database, the err is ${err}`
      )
   );
const Schema = mongoose.Schema;
const mediaSchema = new Schema({
   postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
   },
   addToNoIndex: Boolean,
   title: String,
   metatitle: String,
   metadescription: String,
   body: String,
   articleBody: {
      type: Schema.Types.ObjectId,
      ref: "Body",
   },
   articleTablecontent: String,
   file: String,
   slug: String,
   views: Number,
   dateViewed: Array,
   viewers: [
      {
         ip: String,
         date: Date
      }
   ],
   tags: Array,
   category: {
      type: Schema.Types.ObjectId,
      ref: "Category"
   },
   subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory"
   },
   active: {
      type: Boolean,
      default: false
   },
   postType: {
      type: String,
      enum: ["video", "audio", "post"]
   },
   summary: String,
   download: {
      type: Boolean
   },
   week: String,
   month: String,
   year: String,
   short: String,
   qualify: {
      type: String,
      default: "notqualify"
   },
   upvote: {
      count: {
         type: Number,
         default: 0
      },
      users: [
         {
            date: Date,
            user: {
               type: Schema.Types.ObjectId,
               ref: "User"
            }
         }
      ],
   },
   // downvote: {
   //   count: {
   //     type: Number,
   //     default: 0
   //   },
   //   users: [
   //     {
   //       type: Schema.Types.ObjectId,
   //       ref: "User"
   //     }
   //   ]
   // },
},
   { timestamps: true }
);
var Articles = mongoose.model('articles', mediaSchema);
const hostname = '0.0.0.0';
const port = 3000;
const path = require('path');
var fs = require('fs');
function createMedia(string) {
   const name = `${Date.now().toString()}.png`;
   const dest = `${path.join(
      __dirname,
      "./",
      "media",
      `${name}`
   )}`;
   var data = string.replace(/data.*;base64/gm, '');
   let fileContents = new Buffer(data, 'base64')
   let file = fs.writeFileSync(dest, fileContents);
   let profilePicture = `/media/${name}`;
   return profilePicture;
}
const server = http.createServer(async (req, res) => {
   res.statusCode = 200;
   res.setHeader('Content-Type', 'text/plain');
   let articles = await Articles.find({});
   let index  = 0;
   articles.forEach(async element => {
      let body = JSON.parse(element.body);
      body.forEach(item => {
         switch (item.type) {
            case "image":
               var url = item.data.url;
               if (url.includes('http') == false) {
                  index ++;
                  var imageUrl = createMedia(item.data.url);
                  item.data.url = imageUrl;
               }
         }
      })
      let savebody = JSON.stringify(body);
      let short = element.short;
      short = short.replace(/\[.*]/gm, "");
      await Articles.updateOne({ _id: element._id }, { $set: {short: short} });
   })
   let counts = await Articles.countDocuments({});
   res.end("counts: " + index);
});

server.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/`);
});