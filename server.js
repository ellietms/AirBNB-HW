const Dotenv = require("dotenv");
Dotenv.config();
const express = require("express");
const mongodb = require("mongodb");
const URI = process.env.DATABASE_URI;
const app = express();
const client = new mongodb.MongoClient(URI, { useUnifiedTopology: true });

client.connect(() => {
  const db = client.db("sample_airbnb");
  const collection = db.collection("listingsAndReviews");

  app.get("/search", (request, response) => {
    const { name } = request.query;
    const { summary } = request.query;
    const searchObject = {
      $or: [{ summary: summary }, { name: name }],
    };
    // find rooms by names or summary
    collection.find(searchObject).toArray((error, results) => {
      if (name !== "" || summary !== "") {
        if (error) {
          response.status(500).send(error);
        } else {
          response.send(results);
        }
      } else {
        response.send("Sorry please search again");
      }
    });
  });

  app.get("/films/:price", (request, response) => {
    const { price } = request.params;
    collection.find({}).toArray((error, results) => {
      const filteredByPrice = results.filter((data) => (data.price).toString() === price.toFixed(2));
      if (filteredByPrice !== "") {
        if (error) {
          response.status(500).send("Something went Wrong :(");
        } else {
          response.send(filteredByPrice);
        }
      }
      else{
          response.send("please write your price in the url :)")
      }
    });
  });
});

console.log("working");
app.listen(3000);
