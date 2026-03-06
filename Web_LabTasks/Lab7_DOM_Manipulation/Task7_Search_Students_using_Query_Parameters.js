const express = require("express");
const app = express();
const port = 3000;
var arr=[
{ "id": 1, "name": "Ali", "semester": 8 },
{ "id": 2, "name": "Ahmed", "semester": 7 },
{ "id": 3, "name": "Alyaan", "semester": 2 },
];

app.get("/", (req, res) => {
res.send("Hello World!");
});

app.get("/students", (req, res) => {
if(!req.query.name)
{
    res.json(arr)
}
else
{var ans=arr.find(a=>a.name.toLowerCase()==req.query.name.toLowerCase());
if(ans)
    res.json(ans);
else
    res.status(404).json({ error: "Product not found" });
}
});

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});