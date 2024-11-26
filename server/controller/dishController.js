const Dish = require("../modal/dishModal");
const XLSX = require("xlsx");
const path = require("path");
const dayjs = require("dayjs");
const fs = require("fs");

exports.createDish = async (req, res) => {
  try {
    const { date, items } = req.body;
    if (!date || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid data format." });
    }
    const formattedDate = new Date(date).toISOString();
    let existingDish = await Dish.findOne({ date: formattedDate });

    if (existingDish) {
      existingDish.items.push(...items);
      const updatedDish = await existingDish.save();
      return res.status(200).json(updatedDish);
    } else {
      const newDish = new Dish({
        date: formattedDate,
        items,
      });
      const savedDish = await newDish.save();
      return res.status(201).json(savedDish);
    }
  } catch (error) {
    console.error("Error saving dish:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getDishes = async (req, res) => {
  try {
    const currentDate = new Date();
    const pastDate = new Date();
    const futureDate = new Date();
    pastDate.setDate(currentDate.getDate() - 30);
    futureDate.setDate(currentDate.getDate() + 7);
    const dishes = await Dish.find({
      date: { $gte: pastDate, $lte: futureDate },
    });
    const dateMap = {};
    for (let i = -30; i <= 7; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() + i);
      const dateString = date.toISOString().split("T")[0];

      const existingDish = dishes.find(
        (dish) => new Date(dish.date).toISOString().split("T")[0] === dateString
      );

      dateMap[dateString] = existingDish
        ? { hasMenu: true, items: existingDish.items }
        : { hasMenu: false, items: [] };
    }

    res.status(200).json({ success: true, calendarData: dateMap });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchMenuByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const searchDate = new Date(date);
    if (isNaN(searchDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    const dishes = await Dish.find({ date: searchDate });
    if (dishes.length === 0) {
      return res.status(200).json({ message: "No menu found for this date" });
    }
    res.status(200).json(dishes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the menu" });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const { date, id } = req.params;
    const { name, price, description } = req.body;
    const dish = await Dish.findOne({ date: new Date(date) });
    if (!dish) {
      return res
        .status(404)
        .json({ message: "Dish not found for the given date." });
    }
    const itemIndex = dish.items.findIndex(
      (item) => item._id.toString() === id
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found." });
    }
    dish.items[itemIndex] = {
      ...dish.items[itemIndex],
      name,
      price,
      description,
    };
    const updatedDish = await dish.save();
    res.status(200).json(updatedDish);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDishByDate = async (req, res) => {
  try {
    const { date, id } = req.params;
    const dish = await Dish.findOne({ date: new Date(date) });
    if (!dish) {
      return res
        .status(404)
        .json({ message: "Dish not found for the given date." });
    }
    const itemIndex = dish.items.findIndex(
      (item) => item._id.toString() === id
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found." });
    }
    dish.items.splice(itemIndex, 1);
    const updatedDish = await dish.save();
    res.status(200).json({ message: "Item deleted successfully", updatedDish });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports. deleteAllDishesByDate = async (req, res) => {
  const { date } = req.params;
  try {
    await Dish.deleteMany({ date });
    res.status(200).json({ message: "All menu items deleted successfully." });
  } catch (error) {
    console.error("Error deleting all menu items:", error);
    res.status(500).json({ message: "Failed to delete all menu items." });
  }
};



exports.uploadMenu = async (req, res) => {
  try {
    const file = req.file.path;
    const workbook = XLSX.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    for (const row of sheetData) {
      const { date, name, description, price } = row;
      if (!date || !name || !price) {
        console.warn(`Skipping incomplete row: ${JSON.stringify(row)}`);
        continue;
      }

      let parsedDate;
      let originalFormattedDate;
      if (typeof date === "string") {
        parsedDate = dayjs(date, "DD-MM-YYYY").startOf("day").toDate();
        originalFormattedDate = dayjs(parsedDate).format("YYYY-MM-DD");
      } else if (typeof date === "number") {
        parsedDate = dayjs("1900-01-01")
          .add(date - 2, "days")
          .startOf("day")
          .toDate();
        originalFormattedDate = dayjs(parsedDate).format("YYYY-MM-DD");
      } else {
        console.error(`Unexpected date format: ${date}`);
        continue;
      }
      let existingDish = await Dish.findOne({ date: originalFormattedDate });
      if (!existingDish) {
        existingDish = new Dish({ date: originalFormattedDate, items: [] });
      }
      existingDish.items.push({
        name,
        description: description || "",

        price,
      });
      await existingDish.save();
      console.log(`Created new dish for date: ${originalFormattedDate}`);
    }

    fs.unlinkSync(file);

    // Send success response
    res.status(200).json({ message: "Menu items uploaded successfully!" });
  } catch (error) {
    console.error("Error processing Excel file or saving menu:", error);
    res
      .status(500)
      .json({ error: "Failed to process the Excel file or save menu" });
  }
};
