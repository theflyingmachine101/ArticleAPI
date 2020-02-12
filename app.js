//required packages
const express = require("express");
const bodyParser = require("body-parser");
var request = require("request");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');


//listening port
app.listen(3000,function(){
  console.log("Server started on port 3000");
});


//connection
mongoose.connect("mongodb://127.0.0.1:27017/articleDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
});
var articleSchema= new mongoose.Schema({title:String,Content:String});
var articleModel= mongoose.model("articles",articleSchema);

app.route("/articles")
//get request
.get(function(req,res){
  articleModel.find({},function(err,item){
    res.send(item);
  });
})
//post request
.post(function(req,res){
  var obj=new articleModel({title:req.body.title,Content:req.body.content});
 obj.save();
console.log("je");
})
//delete request
.delete(function(req,res){
  articleModel.deleteMany({},function(err,item)
  {
    if(!err)
    res.send(item);
    else
    res.send("oops error");
  });
});

app.route("/articles/:articleTitle")
//get request
.get(function(req,res){
  articleModel.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle)
    res.send(foundArticle);
    else
    res.send("Ooops not found!");
  });
})
//put request
.put(function(req,res){
  articleModel.update({title:req.params.articleTitle},{title:req.body.title,Content:req.body.content},
    {overwrite:true},function(err,status){
    if(!err)
    res.send("Done");
    else
    res.send("Oops Sorry!");
  });
})
//patch request
.patch(function(req,res){
  articleModel.update({title:req.params.articleTitle},{$set:{Content:req.body.content}},function(err,status){
    if(!err)
    res.send("Done");
    else
    res.send("Oops Sorry!");
  });
})
//delete request
.delete(function(req,res){
  articleModel.deleteOne({title:req.params.articleTitle},function(err,status){
    if(!err)
    res.send("Done");
    else
    res.send("Oops Sorry!");
  });
});
