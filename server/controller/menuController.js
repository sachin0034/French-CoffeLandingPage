const Menu = require("../modal/menuModal");
const XLSX = require("xlsx");
const fs = require("fs");
const dayjs = require("dayjs");
const path = require("path");
const addMenu = async (req, res) => {
  const { date, name, price, description, menuType,category } = req.body;
  try {
    let menu = await Menu.findOne({ date });

    if (menu) {
      menu.items.push({
        name,
        price,
        description,
        menuType,
        category
      });
      await menu.save();
      return res
        .status(200)
        .json({ message: "Menu updated successfully!", menu });
    } else {
      menu = new Menu({
        date,
        items: [
          {
            name,
            price,
            description,
            menuType,
            category
          },
        ],
      });
      await menu.save();
      return res
        .status(201)
        .json({ message: "Menu created successfully!", menu });
    }
  } catch (error) {
    console.error("Error in addMenu:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getMenu = async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);

    const menuData = await Menu.find({
      date: {
        $gte: startDate.toISOString().split("T")[0],
        $lte: endDate.toISOString().split("T")[0],
      },
    }).sort({ date: 1 });

    const formattedData = {};
    menuData.forEach((item) => {
      const dateString = item.date.toISOString().split("T")[0];
      formattedData[dateString] = {
        hasMenu: true,
        menu: {
          name: item.name,
          description: item.description,
          price: item.price,
        },
      };
    });
    const allDates = {};
    for (let i = -30; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      allDates[dateString] = formattedData[dateString] || {
        hasMenu: false,
        menu: null,
      };
    }

    res.status(200).json({ success: true, data: allDates });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch menu data" });
  }
};

const getMenuByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const menu = await Menu.findOne({ date });
    if (menu) {
      res.json(menu);
    } else {
      res.status(200).json({ message: "Menu not found for this date." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
const deleteMenu = async (req, res) => {
  try {
    const { id, date } = req.params;
    const menu = await Menu.findOne({ date });
    if (!menu) {
      return res
        .status(404)
        .json({ message: "Menu not found for the specified date" });
    }
    const updatedItems = menu.items.filter(
      (item) => item._id.toString() !== id
    );
    if (updatedItems.length === 0) {
      await Menu.deleteOne({ date });
      return res.status(200).json({ message: "Menu deleted successfully" });
    }
    menu.items = updatedItems;
    await menu.save();

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editMenu = async (req, res) => {
  try {
    const { date, id } = req.params;
    console.log(date);
    const { menuType, name, price, description } = req.body;
    const validDate = new Date(date);
    if (isNaN(validDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    const menu = await Menu.findOne({ date: validDate });
    if (!menu) {
      return res
        .status(404)
        .json({ message: "Menu not found for the specified date" });
    }
    const item = menu.items.id(id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    if (menuType !== undefined) item.menuType = menuType;
    if (name !== undefined) item.name = name;
    if (price !== undefined) item.price = price;
    if (description !== undefined) item.description = description;

    await menu.save();

    res.status(200).json({ message: "Menu item updated successfully", menu });
  } catch (error) {
    console.error("Error editing menu item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addPrevMenu = async (req, res) => {
  try {
    const { date, menuType } = req.body;
    const { recentdate } = req.params;

    let updateMenu = await Menu.findOne({ date: date });
    let recentMenu = await Menu.findOne({ date: recentdate });
    if (!updateMenu) {
      return res
        .status(202)
        .json({ message: "Menu not found for the given recent date" });
    }
    if (!recentMenu) {
      recentMenu = new Menu({ date: recentdate, items: [] });
      await recentMenu.save();
    }

    if (menuType === "new") {
      recentMenu.items = [...updateMenu.items];
      await recentMenu.save();
      return res.status(200).json({ message: "Menu updated with new items" });
    } else if (menuType === "exist") {
      recentMenu.items = [...recentMenu.items, ...(updateMenu.items || [])];
      await recentMenu.save();
      return res
        .status(200)
        .json({ message: "Menu updated with existing items" });
    }

    return res.status(400).json({ message: "Invalid menu type" });
  } catch (error) {
    console.error("Error in addPrevMenu:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const addWeekMenu = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of sheetData) {
      const { date, menuType, name, description, price,category } = row;
      if (!date || !menuType || !name || !price) {
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
      let menu = await Menu.findOne({ date: originalFormattedDate });
      if (!menu) {
        menu = new Menu({ date: originalFormattedDate, items: [] });
      }
      menu.items.push({
        menuType,
        name,
        description: description || "",
        category,     
        price,
      });
      await menu.save();
    }
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "Menu uploaded and saved successfully!" });
  } catch (error) {
    console.error("Error processing Excel file or saving menu:", error);
    res
      .status(500)
      .json({ error: "Failed to process the Excel file or save menu" });
  }
};

module.exports = {
  addMenu,
  getMenu,
  getMenuByDate,
  deleteMenu,
  editMenu,
  addPrevMenu,
  addWeekMenu,
};
  