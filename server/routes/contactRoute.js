const express = require('express');
const {
  addContact,
  getAllContacts,
  deleteContactById,
  deleteAllContacts,
} = require('../controller/contactController');

const router = express.Router();
router.post('/add', addContact);
router.get('/all', getAllContacts);
router.delete('/delete/:id', deleteContactById);
router.delete('/delete-all', deleteAllContacts);

module.exports = router;
