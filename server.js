const Dotenv = require("dotenv");
Dotenv.config();
const express = require("express");
const mongodb = require("mongodb");
const URI = process.env.DATABASE_URI;
const app = express();
const client = new mongodb.MongoClient(URI,{ useUnifiedTopology: true });

client.connect(() => {
  const db = client.db("sample_airbnb");
  const collection = db.collection("listingsAndReviews");

  app.get("/search", (request, response) => {
    const { name } = request.query;
    const { summary } = request.query;
    const searchObject = {
        $or: [
            {summary:summary},
            {name:name},  
        ],
    }
    // find rooms by names or summary
    collection.find(searchObject).toArray((error, results) => {
      if (name !== "" || summary !== "") {
        if(error){
            response.status(500).send(error);
        }
        else{
            response.send(results);
        }
      }
      else{
          response.send("Sorry please search again");
      }
    });
  });
  



});

console.log("working");
app.listen(3000);