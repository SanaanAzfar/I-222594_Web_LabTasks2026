const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
let astronauts = [
{ "name": "Ayesha Khan", "specialization": "Pilot", "skillLevel": "Advanced" },
{ "name": "Omar Malik", "specialization": "Robotics Engineer", "skillLevel": "Intermediate" }
];

let missions=[];

const ValidateAstronauts = (req, res, next) => {
    let c = req.body;
    let notFound = [];

    for(let j = 0; j < c.crew.length; j++) {
        let found = false;
        for(let i = 0; i < astronauts.length; i++) {
            if(astronauts[i].name.toLowerCase() === c.crew[j].toLowerCase()) {
                found = true;
                break;
            }
        }
        if(!found) {
            notFound.push(c.crew[j]);
        }
    }

    if(notFound.length === 0) {
        next();
    } else {
        res.status(404).json({
            error: "Astronaut(s) not found: " + notFound.join(", ")
        });
    }
};



const AvaliableAstronauts = (req, res, next) => {
let c=req.body;
let check=true
let unavli="";
for(let i=0;i<missions.length;i++)
{
for(let j=0;j<missions[i].crew.length;j++)
{
for(let k=0;k<c.crew.length;k++)
{
    if(missions[i].crew[j].toLowerCase()==c.crew[k].toLowerCase())
    {check=false
    unavli=c.crew[k].toLowerCase();
    }
}
}
}

if(check)
{next();}
else
{res.status(404).json({ error: "Autronaut "+unavli+" is unavaliable" });}
};



app.get("/", (req, res) => {
res.send("Hello World!");
});
app.get("/astronauts", (req, res) => {
res.json(astronauts);
});

app.post("/missions",ValidateAstronauts,AvaliableAstronauts, (req, res) => {
let c=req.body;
    missions.push(c);
res.status(201).json({ message: "Mission added successfully" });;
});

app.get("/missions/:missionName", (req, res) => {
    let mis = missions.find(a => a.missionName.toLowerCase() == req.params.missionName.toLowerCase())

    if (!mis) {
        res.status(404).json({ error: "Mission not found" });
        return;
    }

    let score = 0;
    mis.crew.forEach(crewName => {
        let astronaut = astronauts.find(a => a.name.toLowerCase() == crewName.toLowerCase());
        if (astronaut) {
            switch(astronaut.skillLevel.toLowerCase()) {
                case "intermediate":
                    score += 30;
                    break;
                case "advanced":
                    score += 60;
                    break;
            }
        }
    });

    res.status(200).json({
        message: "missionCapabilityScore: " + score,
        date: mis
    });
});

app.delete("/missions/:missionName", (req, res) => {
let mis=missions.find(a=>a.missionName.toLowerCase()==req.params.missionName.toLowerCase())

if (!mis)
{
res.status(404).json({ error: "Mission not found" });
}

    missions=missions.filter(e=>e.missionName.toLowerCase()==req.params.missionName.toLowerCase());
res.status(200).json({ message: "Mission deleted successfully" });;
});



app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});