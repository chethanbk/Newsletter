const express = require("express")
const bodyParser = require("body-parser")
const https = require("https")
const request = require("request")

// const apiKey = "26598ae10bfc8f9bb6f988124ef379d0-us11";          // (mail chimp)
// const audienceId = "9bf2fd06e2";          //aidience Id mailchimp
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

const firstName= req.body.fname;
const lastName= req.body.lname;
const email= req.body.email;

console.log(firstName, lastName, email);

// Below is the data in Javascript format
const data = {

    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
            FNAME: firstName,
            LNAME: lastName
        }

      }
    ]
};

// Turning above data into JSAON whcih can be accepted by mailchimp server

const jsonData = JSON.stringify(data);
// Posting the data to derver
const url = "https://us11.api.mailchimp.com/3.0/lists/9bf2fd06e2";
const options = {
    method: "POST",
    auth:"CHETHAN:26598ae10bfc8f9bb6f988124ef379d0-us11"
}
const request = https.request(url, options, function(response){
    if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html")
    } 
    else {
        res.sendFile(__dirname + "/failure.html")

    }
    response.on("data", function(data){
        console.log(JSON.parse(data));
    })
})
request.write(jsonData);
request.end();

})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000")

})
