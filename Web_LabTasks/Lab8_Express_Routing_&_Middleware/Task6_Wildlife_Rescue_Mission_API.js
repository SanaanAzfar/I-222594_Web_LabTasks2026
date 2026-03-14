const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

const checkAnimalType = (req, res, next) => {
  const animal = req.body.animalType;
  if (animal === "bird") req.animalFactor = 1;
  else if (animal === "mammal") req.animalFactor = 2;
  else if (animal === "reptile") req.animalFactor = 3;
  else req.animalFactor = 2;
  next();
};

const checkSeverity = (req, res, next) => {
  const level = req.body.severity;
  if (level === "mild") req.severityFactor = 1;
  else if (level === "moderate") req.severityFactor = 2;
  else if (level === "severe") req.severityFactor = 3;
  else req.severityFactor = 2;
  next();
};

const checkResources = (req, res, next) => {
  const total = req.animalFactor + req.severityFactor;
  if (total <= 3) req.resources = "enough";
  else if (total <= 5) req.resources = "limited";
  else req.resources = "insufficient";
  next();
};

const determineOutcome = (req, res, next) => {
  if (req.resources === "enough") req.outcome = "success";
  else if (req.resources === "limited") req.outcome = "delayed";
  else req.outcome = "unsuccessful";
  next();
};

const errorHandler = (err, req, res, next) => {
  res.status(500).json({ message: "Something went wrong" });
};

app.post(
  "/rescue-mission",
  checkAnimalType,
  checkSeverity,
  checkResources,
  determineOutcome,
  (req, res) => {
    res.json({
      message: "Rescue mission processed",
      outcome: req.outcome,
    });
  }
);

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
