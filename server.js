const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3011);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/uploads", express.static("uploads"));

const db = require('./models/mysql');

db.sequelize.sync()
  .then(() => {
    console.log('Synced db');
  })
  .catch((err) => {
    console.log('Error syncing db', err);
})


const mongodbConn = require("./db/mongodb");

mongodbConn
  .once("open", () => {
    console.log("MongoDB connection has been established successfully.");
  })
  .on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

  
require("./routes/userRoutes")(app)
require("./routes/carRoutes")(app)


app.get("/", (req, res) => {
    res.json({ message: "Hi there" });
});
  

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

// app.listen(app.get("port"), "0.0.0.0", () => {
//   console.log(`Server running at http://0.0.0.0:${app.get("port")}`);
// });
