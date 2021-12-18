//jshint esversion:6

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const ejs = require("ejs");
const _ = require('lodash');

app.set('view engine', 'ejs');

app.use(express.static("public"));

const homeStartingContent = " The Daily Journal is published six days a week, Monday through Friday plus a combo Weekend edition. The newspaper is distributed throughout San Mateo County and northern Santa Clara County, and all over the world through smdailyjournal.com. It Also Facilate to Create your Own Posts.";
const aboutContent = "dailyjournal.com is the interactive, online version of the San Mateo Daily Journal.\n  The Daily Journal is published six days a week, Monday through Friday plus a combo Weekend edition. The newspaper is distributed throughout San Mateo County and northern Santa Clara County, and all over the world through smdailyjournal.com.\nIt is the mission of the Daily Journal to be the most accurate, fair and relevant local news source for those who live, work or play on the San Francisco Peninsula. By combining local news coverage, analysis and insight with the latest business, lifestyle, state, national and world news, we seek to provide our readers with the highest quality information resource in the local area. Our pages belong to you, our readers, and we choose to reflect the diverse character of this dynamic and ever changing community.";

const contactContent = "The Daily Journal's office is located at:1720 S. Amphlett Blvd. #123, San Mateo CA 94402 Phone: (650) 344-5200 IN PERSON Business hours are from 9 a.m. to 3 p.m., Monday-Friday.";

const mongoose = require("mongoose");
// let PostArrays = [];


//Connecting & Creating new DataBase on Atlas
mongoose.connect("mongodb+srv://admin-vivek:adminpassword@cluster0.ccarn.mongodb.net/dailyjournalDB", { useNewUrlParser: true });

//Creating Schema For New Collection (Replacement for Arrays)
const postsSchema = new mongoose.Schema({
  postTitle: String,
  postContent: String
});

//Creating New Collection
const postsCollect = mongoose.model("postsCollect", postsSchema);



// Home Page where all Posts are loaded
app.get("/", function (req, res) {

  postsCollect.find({}, function (err, foundDocs) {

    res.render("home", { HomeData1: homeStartingContent, HomeData2: foundDocs });
  });

});

app.get("/about", function (req, res) {
  res.render("about", { AboutData: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { ContactData: contactContent });
});

app.get("/compose", function (req, res) {

  res.render("compose");
});

app.post("/compose", function (req, res) {
  const postdata = new postsCollect({
    postTitle: req.body.newTitle,
    postContent: req.body.newText
  });

  // PostArrays.push(postdata);
  postsCollect.insertMany([postdata], function (err) {
    if (err) { console.log(err); }
    else { console.log("New Post Doc Added Successfully in Collection..."); }
  });

  res.redirect("/");
});

//.......Delete all post or Compose New by taking value from button
app.post("/", (req, res) => {
  if (req.body.submit === "add") { res.redirect("compose"); }
  else {

    postsCollect.deleteMany({}, function (err) {
      if (err) { console.log("Not anle to delete posts"); }
      else { console.log("Sucessfuly Deleted all Docs of posts"); }
    });

    res.redirect("/");
  }
});

// Finding Doc in Collection & Rendering it on New Page 
app.get("/posts/:postName", function (req, res) {
  let name = req.params.postName; var find = 0;
  var ele;

  postsCollect.find({}, function (err, foundDocs) {

    foundDocs.forEach(function (element) {
      if (_.lowerCase(element.postTitle) === _.lowerCase(name)) {
        find = 1; ele = element;
      }

    });
    if (find === 1) { res.render("posts", { Title: ele.postTitle, Text: ele.postContent }); }
    else { console.log("Not Found"); }

  });

});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started ...");
});
