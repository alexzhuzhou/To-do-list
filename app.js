import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getDate } from "./date.js";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const app = express();


let newTasks = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", function(req,res) {
    
    let day = getDate();
    
    res.render("list", {listTitle: day, newListItems: newTasks});
});

app.post("/", function(req, res) {

    let newTask = req.body.nextTask;
    if (req.body.list === "Work") {
        workItems.push(newTask);
        res.redirect("/work");
    }
    else {
        newTasks.push(newTask);
        res.redirect("/");
    }


    
});


app.get("/work", function(req,res) {
    res.render("list", {listTitle:"Work List", newListItems: workItems});

});

app.post("/work", function(req, res) {
    let item = req.body.nextTask;
    workItems.push(item);

    res.redirect("/work");
});


app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log("Server started on port 3000")
});