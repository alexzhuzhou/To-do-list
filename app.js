import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import mongoose from "mongoose";
import { networkInterfaces } from "os";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB");

// Create collection schema
const itemsSchema = {
    name : String
};

const listSchema = {
    name: String,
    items: [itemsSchema]
};

// Create Collection
const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

// Create Documents
const task1 = new Item({
    name: "Welcome to your todolist!"
});

const task2 = new Item({
    name: "Hit the + button to add a new item"
});

const task3 = new Item({
    name: "<-- Hit this to delete an item."
});


const defaultItems = [task1, task2, task3];




app.get("/", function(req,res) {

    Item.find()
    .then((foundItems) =>{
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems)
                .then(() => {
                    console.log("The documents have successfully been uploaded");
                })
                .catch((err) =>{
                    console.log(err);
                });
                res.redirect("/");
        }
        else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    })
    .catch((err) => {
        consol.log(err);
    });
    
});
app.get("/:customListName", function(req, res) {
    const customListName = req.params.customListName;

    List.findOne({name: customListName})
        .then((foundList) => {
            if(!foundList) {
                // Create a new list
                const list = new List({
                    name: customListName,
                    items : defaultItems
                })
                list.save();
                res.redirect("/:customListName");
            }
            else {
                // Show an existing list.
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        })
        .catch((err) => {
            console.log(err);
        });
    
});

app.post("/", function(req, res) {

    const itemName = req.body.nextTask;
    const listName = req.body.list;

    const newItem = new Item ({
        name: itemName
    });

    if (listName === "Today") {
        newItem.save();
        res.redirect("/");
    }
    else {
        List.findOne({name:listName})
            .then((foundList) => {
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + listName);
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    console.log(listName);

    if (listName === "Today") {
        Item.findByIdAndDelete(checkedItemId)
        .then(() =>{
            console.log("Item successfully deleted");
            res.redirect("/");

        })
        .catch((err) => {
            console.log(err);
        });
    }
    else {
        List.findOneAndUpdate(
            {name: listName},
            {$pull: {items: {_id: checkedItemId}}},
        )
        .then(() => {
            res.redirect("/" + listName);
        })

    }

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