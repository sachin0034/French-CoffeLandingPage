const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
app.use(cors({ origin: "*" }));
require("dotenv").config();
const db = require("./config/dbConn");

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "./sample")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const userRoute = require("./routes/userRoute");
const menuRoute = require("./routes/menuRoute");
const chefRoute = require("./routes/chefRoute");
const contactRoute = require("./routes/contactRoute");

app.use("/api/auth", userRoute);
app.use("/api/menu", menuRoute);
app.use("/api/chef", chefRoute);
app.use("/api/contact", contactRoute);

// sample file download

app.get("/menu-download", (req, res) => {
  try {
    const filePath = path.join(__dirname, "./sample/sample-weekly-menu.xlsx");
    console.log("File path:", filePath);

    res.download(filePath, "sample-menu-weekly.xlsx", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Server error." });
      }
    });
  } catch (error) {
    console.error("Unexpected server error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
