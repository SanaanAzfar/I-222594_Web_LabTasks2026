const express = require("express");
const app = express();
const port = 3000;
var arr=[
{ "id": 1, "name": "Laptop", "price": 900 },
{ "id": 2, "name": "Mouse", "price": 20 },
{ "id": 3, "name": "Keyboard", "price": 50 }
];

app.get("/", (req, res) => {
res.send("Hello World!");
});
app.get("/products", (req, res) => {
res.json(arr);
});


app.get("/products/:id", (req, res) => {
var ans=arr.find(a=>a.id==req.params.id);
if(ans)
{
    res.json(ans)
}
else
{res.status(404).json({ error: "Product not found" });}
});

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});