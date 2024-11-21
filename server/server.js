const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
require("dotenv").config();
const db = require("./config/dbConn");

const PORT = 5000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const userRoute = require("./routes/userRoute");
const menuRoute = require("./routes/menuRoute");

app.use("/api/auth", userRoute);
app.use("/api/menu", menuRoute);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
