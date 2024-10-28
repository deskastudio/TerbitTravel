import Contact from "../models/contact.js";

// Fungsi untuk menambahkan data kontak (hanya bisa dilakukan sekali)
export const addContact = async (req, res) => {
  try {
    const contactCount = await Contact.countDocuments();

    if (contactCount > 0) {
      return res.status(400).json({
        message: "Contact data already exists. You can only update it.",
      });
    }

    const newContact = new Contact(req.body);
    await newContact.save();
    res
      .status(201)
      .json({ message: "Contact data added successfully", data: newContact });
  } catch (error) {
    res.status(500).json({ message: "Error adding contact data", error });
  }
};

// Fungsi untuk mengedit data kontak yang sudah ada
export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOne();

    if (!contact) {
      return res
        .status(404)
        .json({ message: "No contact data found to update." });
    }

    // Update data kontak
    const updatedContact = await Contact.findByIdAndUpdate(
      contact._id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Contact data updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating contact data", error });
  }
};

// Fungsi untuk menampilkan data kontak yang sudah ada
export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne();

    if (!contact) {
      return res.status(404).json({ message: "No contact data found." });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact data", error });
  }
};
