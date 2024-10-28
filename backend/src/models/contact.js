import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  instagram: { type: String },
  email: { type: String },
  whatsapp: { type: String },
  youtube: { type: String },
  facebook: { type: String },
  alamat: { type: String },
});

// Kita hanya menginginkan satu set data
const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
