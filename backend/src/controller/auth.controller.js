const { sign } = require("../../utils/libs/jwt.lib");

const User = require('../models/User');
const Contact = require('../models/Contact');

const create = async (req, res) => {
    try {
        const data = req.body;
        const first_name = data.first_name.toLowerCase();
        const last_name = data.last_name.toLowerCase();
        const find = await User.findOne({ first_name, last_name });
        if (find) {
            return res.status(404).json({
                message: "User already exists",
            })
        }

        await User.create({ ...data, first_name, last_name });

        return res.status(201).json({
            message: "User created successfully"
        })

        
    } catch (err) {
        console.log("Error creating user:", err)
        return res.status(500).json({
            message: "Internal server error encountered while creating user"
        })

    }
};

const add = async (req, res) => {
    try {
        const data = req.body;
        // const fullname = data.fullname.toLowerCase();
        const phone = data.phone;
        const email = data.email;
        const find = await Contact.findOne({ phone, email });
        if (find) {
            return res.status(404).json({
                message: "Contact already exists"
            })
        }

        await Contact.create({ ...data, phone, email });

        return res.status(201).json({
            message: "Contact created successfully"
        })

    } catch (err) {
        console.log("Error creating contact:", err)
        return res.status(500).json({
            message: "Internal server error encountered while creating contact"
        })
    }
}

const read = async (req, res) => {
    try {
        const contacts = await Contact.find();
        return res.json({
            message: "Contacts retrieved successfully !!!",
            data: contacts
        })
    } catch (err) {
        console.log("Error retrieving contacts:", err)
        return res.status(500).json({
            message: "Internal server error encountered while retrieving contacts"
        })
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        await Contact.findByIdAndUpdate(id, { ...data });

        return res.status(201).json({
            message: "Contact updated successfully !!!"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error encountered while updating contact"
        })
    }
}

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        await Contact.findByIdAndDelete(id, {...data});
        
        return res.status(201).json({
            message: "Contact deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error encountered while deleting contact"
        })
    }
}


module.exports = { create, add, read, update, remove }