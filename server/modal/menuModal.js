const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      unique: true,
    },
    items: [
      {
        menuType: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: [true, "Menu item name is required"],
        },
        description: {
          type: String,
          default: "",
        },
        category: {
          type: String,
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
        },
      },
    ],
    isBackup: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

menuSchema.statics.deleteOldMenus = async function () {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  await this.deleteMany({ date: { $lt: oneMonthAgo }, isBackup: false });
};

menuSchema.statics.backupMenus = async function () {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const oldMenus = await this.find({
    date: { $lt: oneMonthAgo },
    isBackup: false,
  });
  for (const menu of oldMenus) {
    menu.isBackup = true;
    await menu.save();
  }
};

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
