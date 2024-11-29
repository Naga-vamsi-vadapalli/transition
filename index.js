const express = require("express");
const axios = require("axios");
const rules = require("./config/rules");


const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static("public"));

// Set EJS as the template engine
app.set("view engine", "ejs");

// Fetch data from the API
const fetchData = async () => {
  try {
    const response = await axios.get(
      "http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
};

// Evaluate checklist rules
const evaluateRules = (data) => {
  return rules.map((rule) => ({
    name: rule.name,
    status: rule.condition(data) ? "Passed" : "Failed",
  }));
};

// Route to display the dashboard
app.get("/", async (req, res) => {
  const data = await fetchData();
  if (!data) {
    return res.status(500).send("Failed to fetch data from API.");
  }
  const results = evaluateRules(data);
  res.render("dashboard", { results });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
