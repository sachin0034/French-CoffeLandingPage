const ChefSuggestion = require("../modal/chefModal");
exports.addMenu = async (req, res) => {
  try {
    const { name, description, category, price, isAvailable } = req.body;
    const newChefSuggestion = new ChefSuggestion({
      name,
      description,
      category,
      price,
      isAvailable,
    });
    const savedSuggestion = await newChefSuggestion.save();
    res.status(201).json({
      success: true,
      message: "Chef Suggestion added successfully",
      data: savedSuggestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding Chef Suggestion",
      error: error.message,
    });
  }
};

exports.getMenu = async (req, res) => {
  try {
    const suggestions = await ChefSuggestion.find();
    res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Chef Suggestions",
      error: error.message,
    });
  }
};

exports.getMenuByDate = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedSuggestion = await ChefSuggestion.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedSuggestion) {
      return res
        .status(404)
        .json({ success: false, message: "Chef Suggestion not found" });
    }

    res.status(200).json({
      success: true,
      message: "Chef Suggestion updated",
      data: updatedSuggestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Chef Suggestion",
      error: error.message,
    });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSuggestion = await ChefSuggestion.findByIdAndDelete(id);

    if (!deletedSuggestion) {
      return res
        .status(404)
        .json({ success: false, message: "Chef Suggestion not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Chef Suggestion deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting Chef Suggestion",
      error: error.message,
    });
  }
};
