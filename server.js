const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bookingsController = require('./controllers/bookingsController');

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
};


app.post(
  '/webhook',
  express.raw({ type: 'application/json' }), 
  (req, res) => {
    bookingsController.handleStripeWebhook(req, res);
  }
);


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

require("./routes/userRoutes")(app)
require("./routes/carRoutes")(app)
require("./routes/reviewsRoutes")(app)
require("./routes/maintenanceRoutes")(app)

app.get("/", (req, res) => {
    res.json({ message: "Hi there" });
});
  

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

