const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const app = require("./index");

// MONGODB CONNECTION

const DB_URL = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.comgcyj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Successfully Connected");

    // mongoose.connection.db.collection('notes').insertOne({
    //   "title": "HTML",
    //   "description": "HTML is Hyper Text Markup Language",
    //   "created_at": "5-01-2023",
    //   "updated_at": "18-10-2023",
    //   "important": false,
    //   "priority": 2
    // })
    // .then(() => console.log('New Note is added'));
  })
  .catch((error) => {
    console.error(error);
  });

app.listen(process.env.PORT, "localhost", () => {
  console.log(`server is running on at port: ${process.env.PORT}`);
});
