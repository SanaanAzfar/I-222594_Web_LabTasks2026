const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
let courses = [
{ id: 1, name: "Data Structures", seats: 30 },
{ id: 2, name: "Operating Systems", seats: 25 }
];

app.get("/", (req, res) => {
res.send("Hello World!");
});
app.get("/courses", (req, res) => {
res.json(courses);
});


app.get("/courses/:id", (req, res) => {
var ans=courses.find(a=>a.id==req.params.id);
if(ans)
{
    res.json(ans)
}
else
{res.status(404).json({ error: "course not found" });}
});

app.post("/courses", (req, res) => {
let c=req.body;
    courses.push(c);
res.status(201).json({ message: "Course added successfully" });;
});

app.put("/courses/:id", (req, res) => { //needs error handling
let c=req.body;
var ans=courses.find(a=>a.id==req.params.id)
if(ans)
{
    courses.find(a=>a.id==req.params.id).seats=c.seats;
res.status(200).json({ message: "Course updated successfully" });;
}
else
{res.status(404).json({ error: "course not found" });}
});

app.delete("/courses/:id", (req, res) => { //needs error handling
var ans=courses.find(a=>a.id==req.params.id)
    if(ans)
{
    courses=courses.filter(a=>a.id!=req.params.id);
res.status(200).json({ message: "Course deleted successfully" });;
}
else
{res.status(404).json({ error: "course not found" });}
});


app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});