//jshint esversion:6

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const ejs = require("ejs");
const _ = require('lodash');

const homeStartingContent = " The Daily Journal is published six days a week, Monday through Friday plus a combo Weekend edition. The newspaper is distributed throughout San Mateo County and northern Santa Clara County, and all over the world through smdailyjournal.com. It Also Facilate to Create your Own Posts.";
const aboutContent = "dailyjournal.com is the interactive, online version of the San Mateo Daily Journal.\n  The Daily Journal is published six days a week, Monday through Friday plus a combo Weekend edition. The newspaper is distributed throughout San Mateo County and northern Santa Clara County, and all over the world through smdailyjournal.com.\nIt is the mission of the Daily Journal to be the most accurate, fair and relevant local news source for those who live, work or play on the San Francisco Peninsula. By combining local news coverage, analysis and insight with the latest business, lifestyle, state, national and world news, we seek to provide our readers with the highest quality information resource in the local area. Our pages belong to you, our readers, and we choose to reflect the diverse character of this dynamic and ever changing community.";

const contactContent = "The Daily Journal's office is located at:1720 S. Amphlett Blvd. #123, San Mateo CA 94402 Phone: (650) 344-5200 IN PERSON Business hours are from 9 a.m. to 3 p.m., Monday-Friday.";

let PostArrays = [];

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/", function (req, res) {

  res.render("home", { HomeData1:homeStartingContent ,HomeData2: PostArrays });

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
  const postdata = {
    postTitle: req.body.newTitle,
    postText: req.body.newText
  }

  PostArrays.push(postdata);
  res.redirect("/");
});

app.post("/",(req,res)=>{
  if(req.body.submit==="add")
{ res.redirect("compose"); }
else{ PostArrays.length=0; res.redirect("/");}
});

app.get("/posts/:postName", function (req, res) {
  let name = req.params.postName; var find = 0;
  var ele;
  PostArrays.forEach(function (element) {
    if (_.lowerCase(element.postTitle) === _.lowerCase(name)) {
      find = 1; ele = element;
    }

  });
  if (find === 1) { res.render("posts", { Title: ele.postTitle, Text: ele.postText }); }
  else { console.log("Not Found"); }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started ...");
});
