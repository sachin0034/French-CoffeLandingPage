const Contact = require("../modal/contactModal");

exports.addContact = async (req, res) => {
  try {
    const { email, phone, message } = req.body;
    const contact = new Contact({ email, phone, message });
    await contact.save();
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};  

exports.deleteContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAllContacts = async (req, res) => {
  try {
    await Contact.deleteMany();
    res
      .status(200)
      .json({ success: true, message: "All contacts deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
