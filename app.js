require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const app = express();

let ApiKey = process.env.API_KEY;
let listId = process.env.LIST_ID;
let serverNumber = process.env.SERVER_NUMBER;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});
console.log(ApiKey);
app.post("/", (req, res) => {
  const fName = req.body.fname;
  const lName = req.body.lname;
  const eMail = req.body.email;

  const options = {
    method: "POST",
    auth: `key:${ApiKey}`,
  };
  let data = {
    members: [
      {
        email_address: eMail,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };
  const url = `https://us${serverNumber}.api.mailchimp.com/3.0/lists/${listId}`;

  const jsonData = JSON.stringify(data);

  let request = https.request(url, options, (response) => {
    response.statusCode == 200
      ? res.sendFile(`${__dirname}/success.html`)
      : res.sendFile(`${__dirname}/failure.html`);
  });

  request.write(jsonData);
  request.end();
});
app.post("/failure", (req, res) => {
  res.redirect("/");
});
app.listen(3000, () => {
  console.log("server is running");
});
