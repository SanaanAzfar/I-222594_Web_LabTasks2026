const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
let requestCount = 0;

const countRequests = (req, res, next) => {
requestCount++;
next();
};


app.get("/", (req, res) => {
res.send("Hello World!");
});

app.get("/stats",countRequests, (req, res) => {
res.status(200).json({ message: 'Total API Request:'+requestCount });
});

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`);
});