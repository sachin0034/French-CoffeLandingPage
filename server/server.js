const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const moment = require("moment");

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
const categoryRoute = require("./routes/categoryRoute");
const dishRoute = require("./routes/dishRoute");
const Menu = require("./modal/menuModal");

app.use("/api/auth", userRoute);
app.use("/api/menu", menuRoute);
app.use("/api/chef", chefRoute);
app.use("/api/contact", contactRoute);
app.use("/api/category", categoryRoute);
app.use("/api/dish", dishRoute);

// sample file download

app.get("/menu-download", (req, res) => {
  try {
    const filePath = path.join(__dirname, "./sample/sample-menu-weekly.xlsx");
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
app.get("/dish-download", (req, res) => {
  try {
    const filePath = path.join(__dirname, "./sample/sample-dish.xlsx");
    res.download(filePath, "sample-dish.xlsx", (err) => {
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

app.get("/menu-left", async (req, res) => {
  try {
    const today = moment().startOf("day");
    const menuDates = await Menu.find({
      date: { $gte: today.toDate() },
    }).sort({ date: 1 });
    if (menuDates.length === 0) {
      return res.status(200).json({ data: [], daysLeft: [] });
    }
    const daysLeft = [];
    const data = [];
    let currentDate = moment(today);
    for (let i = 0; i < menuDates.length; i++) {
      const menuDate = moment(menuDates[i].date).startOf("day");
      while (currentDate.isBefore(menuDate)) {
        const menuItems = [];
        if (menuItems.length > 0) {
          daysLeft.push(currentDate.format("YYYY-MM-DD"));
          data.push({
            date: currentDate.format("YYYY-MM-DD"),
            items: menuItems,
          });
        }
        currentDate.add(1, "days");
      }
      if (menuDates[i].items.length > 0) {
        daysLeft.push(menuDate.format("YYYY-MM-DD"));
        data.push({
          date: menuDate.format("YYYY-MM-DD"),
          items: menuDates[i].items,
        });
      }
      currentDate = menuDate.add(1, "days");
    }
    const sequentialDaysLeft = [];
    const sequentialData = [];
    let expectedDate = moment(today);
    for (let i = 0; i < daysLeft.length; i++) {
      const currentDay = moment(daysLeft[i], "YYYY-MM-DD");
      if (!currentDay.isSame(expectedDate)) {
        break;
      }
      sequentialDaysLeft.push(daysLeft[i]);
      sequentialData.push(data[i]);
      expectedDate.add(1, "days");
    }
    res
      .status(200)
      .json({ daysLeft: sequentialDaysLeft, data: sequentialData });
  } catch (error) {
    console.error("Error fetching menu dates:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
