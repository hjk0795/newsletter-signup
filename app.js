const conf = require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const { json } = require("body-parser");


var firstName = "";
var lastName = "";
var email = "";

let API_KEY = process.env.API_KEY;
let LIST_ID = process.env.LIST_ID;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});




app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
  console.log(API_KEY);
});

app.post("/", function (req, res) {
  firstName = req.body.firstName;
  lastName = req.body.lastName;
  email = req.body.email;

  var data = {
    members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
        },
    }]
  };

  var jsonData = JSON.stringify(data);
  url = `https://us9.api.mailchimp.com/3.0/lists/${LIST_ID}`
  const options = {
    method: "POST",
    auth: `Kim:${API_KEY}-us9`
  }

  const request = https.request(url, options, function(response){

    response.on("data", function(data){
        var receivedData = JSON.parse(data);
        console.log(receivedData);

        if (receivedData.error_count == 0) {
            res.sendFile(__dirname+"/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }

      
    })

    
  })

  request.write(jsonData);
  request.end();

  
});

