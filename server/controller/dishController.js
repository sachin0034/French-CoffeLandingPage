const Dish = require("../modal/dishModal");
exports.createDish = async (req, res) => {
  try {
    const { date, name, price, description, discountPrice, category } =
      req.body;

    const newItem = {
      name,
      price,
      description,
      discountPrice,
      category,
    };
    let existingDish = await Dish.findOne({
      date: new Date(date).toISOString(),
    });

    if (existingDish) {
      existingDish.items.push(newItem);
      const updatedDish = await existingDish.save();
      return res.status(200).json(updatedDish);
    } else {
      const newDish = new Dish({
        date,
        items: [newItem],
      });
      const savedDish = await newDish.save();
      return res.status(201).json(savedDish);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    console.log(date);
    const searchDate = new Date(date);
    if (isNaN(searchDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    const dishes = await Dish.find({ date: searchDate });
    if (dishes.length === 0) {
      return res.status(404).json({ message: "No menu found for this date" });
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
    const { name, price, description, discountPrice, category } = req.body;
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
      discountPrice,
      category,
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
