const express = require("express");
const { connectToDb, getDb } = require("./db");


//init app & middleware
const app = express();
app.use(express.json());

//db connection
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});


//routes
app.get("/books", (req, res) => {
  let books = [];
  //db.books
  db.collection("books")
    .find()
    .sort({ author: 1 })
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    }); //cursor toArray forEach

   res.json({ msg: "welcome to the api" });
});



//add the books
app.post("/books", (req, res) => {
    const book = req.body;
    db.collection("books")
      .insertOne(book)
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({ err: "Could not create a new document" });
      });
  });
  

  //delete the book
  app.delete("/books/:id", (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
      db.collection("books")
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(500).json({ error: "Could not delete document" });
        });
    } else {
      res.status(500).json({ error: "Could not delete document" });
    }
  });
  