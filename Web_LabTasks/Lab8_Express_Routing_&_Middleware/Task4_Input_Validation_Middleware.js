const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

let missions=[];

const validateMission = (req, res, next) => {

if(req.body.missionName || req.body.crew)
{next();}
else
{res.status(400).json({ error: "Invalid Request: Required fields missing" });}
};


app.get("/", (req, res) => {
res.send("Hello World!");
});
app.get("/missions", (req, res) => {
res.json(missions);
});

app.post("/missions", (req, res) => {
let c=req.body;
    missions.push(c);
res.status(201).json({ message: "Mission added successfully" });;
});

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});