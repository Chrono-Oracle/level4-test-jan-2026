const { sign } = require("../../utils/libs/jwt.lib");

const User = require("../models/User");
const Contact = require("../models/Contact");

const formatName = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const first_name = formatName(data.first_name);
    const last_name = formatName(data.last_name);
    const find = await User.findOne({ first_name, last_name });
    if (find) {
      return res.status(404).json({
        message: "User already exists",
      });
    }

    await User.create({ ...data, first_name, last_name });

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.log("Error creating user:", err);
    return res.status(500).json({
      message: "Internal server error encountered while creating user",
    });
  }
};

const add = async (req, res) => {
  try {
    const data = req.body;
    const formattedFullname = formatName(data.fullname);
    const phone = data.phone;
    const email = data.email;
    const find = await Contact.findOne({ $or: [{ phone }, { email }, { fullname: formattedFullname }]});
    if (find) {
      return res.status(404).json({
        message: "Contact already exists",
      });
    }

    const newContact = await Contact.create({ ...data, fullname: formattedFullname phone, email });
    return res.status(201).json(newContact);
  } catch (err) {
    console.log("Error creating contact:", err);
    return res.status(500).json({
      message: "Internal server error encountered while creating contact",
    });
  }
};

const read = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts); // Change this line
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // if (data.fullname) {
    //     data.fullname = formatName(data.fullname);
    // }

    await Contact.findByIdAndUpdate(id, { ...data });

    return res.status(201).json({
      message: "Contact updated successfully !!!",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error encountered while updating contact",
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    await Contact.findByIdAndDelete(id, { ...data });

    return res.status(201).json({
      message: "Contact deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error encountered while deleting contact",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { create, add, read, update, remove, getUsers };
