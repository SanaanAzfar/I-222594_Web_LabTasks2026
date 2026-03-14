const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
let books = [
{ id: 1, title: "Clean Code", author: "Robert Martin" },
{ id: 2, title: "Introduction to Algorithms", author: "CLRS" }
];

app.get("/", (req, res) => {
res.send("Hello World!");
});
app.get("/books", (req, res) => {
res.json(books);
});


app.get("/books/:id", (req, res) => {
var ans=books.find(a=>a.id==req.params.id);
if(ans)
{
    res.json(ans)
}
else
{res.status(404).json({ error: "book not found" });}
});

app.post("/books", (req, res) => {
let c=req.body;
    books.push(c);
res.status(201).json({ message: "book added successfully" });;
});

app.put("/books/:id", (req, res) => { //needs error handling
let c=req.body;
var ans=books.find(a=>a.id==req.params.id)
if(ans)
{
    if(c.title){
    books.find(a=>a.id==req.params.id).title=c.title;
    }

        if(c.author){
    books.find(a=>a.id==req.params.id).author=c.author;
    }
    res.status(200).json({ message: "book updated successfully" });;
}
else
{res.status(404).json({ error: "book not found" });}
});

app.delete("/books/:id", (req, res) => { //needs error handling
var ans=books.find(a=>a.id==req.params.id)
    if(ans)
{
    books=books.filter(a=>a.id!=req.params.id);
res.status(200).json({ message: "book deleted successfully" });;
}
else
{res.status(404).json({ error: "book not found" });}
});


app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});