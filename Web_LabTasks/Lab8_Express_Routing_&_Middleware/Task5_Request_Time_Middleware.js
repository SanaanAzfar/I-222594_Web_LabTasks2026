const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
let requestCount = 0;

const countRequests = (req, res, next) => {
var time= new Date();
    req.requestTime =time.toISOString();
next();
};


app.get("/", (req, res) => {
res.send("Hello World!");
});

app.get("/request-time",countRequests, (req, res) => {
res.status(200).json({ message: 'This request was received at: '+req.requestTime });
});

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});