const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const units = "imperial";
  const query = req.body.cityName;
  const apiKey = "9a4b4d0a84792a5187b849461420d968";

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    units;

  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.feels_like;
      const weatherDescription = weatherData.weather[0].description;
      const weatherIcon = weatherData.weather[0].icon;

      //build results
      const localWeather = `<h3>The weather is currently ${weatherDescription}</h3>
            <h3>The temperature in ${query} is ${temp} degrees Fahrenheit.</h3>
            <img src='http://openweathermap.org/img/wn/${weatherIcon}@2x.png'>`;

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(localWeather);
      res.send();
    });
  });
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
