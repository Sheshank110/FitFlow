const Contact = require('../models/Contact');

// POST /api/contact
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({
      success: true,
      message: "Message received! We'll get back to you within 24 hours.",
      data: { id: contact._id, createdAt: contact.createdAt },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContact };
