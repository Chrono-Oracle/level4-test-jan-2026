require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const authController = require('./src/controller/auth.controller')
const { userValidation, contactValidation } = require('./utils/validations/auth.validation')
const { isLogin } = require('./utils/middlewares/auth.middleware')

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        const PORT = process.env.PORT;
        const app = express();

        app.use(express.json());

        //Create a User
        app.post('/users/create', userValidation, authController.create);

        //Add a Contact
        app.post('/contacts/add', contactValidation, authController.add);
        //Read Contacts
        app.get('/contacts', authController.read)
        //Update Contact by Id
        app.put('/contacts/update/:id', authController.update);
        //Delete Contact by Id
        app.delete('/contacts/remove/:id', authController.remove);

        app.listen(PORT, () => {
            const baseUrl = "http://localhost:" + PORT;
            console.log(`Server is running on ${baseUrl}`);
        });
    }).catch(err => {
        console.error("Failed to connect to MongoDB:", err);
    })